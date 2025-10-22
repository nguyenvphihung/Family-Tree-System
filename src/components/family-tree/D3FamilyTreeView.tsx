import React, { Children, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../../types/family';

import { personService, relationService } from '../../services';
import { getPersonAvatar } from '../../assets/avatars';
import { formatDateCompact } from '../../utils/familyUtils';
import cameraIcon from '../../assets/avatars/camera.png';
import ContextMenu from './ContextMenu';

interface D3FamilyTreeViewProps {
  treeId: string
  personId: string;
  zoomLevel?: number;
  onRefresh?: () => void;
  onNodeClick?: (person: FamilyMember) => void;
  // Callback handlers từ parent component
  onAddChild?: (person: FamilyMember) => void;
  onAddParent?: (person: FamilyMember) => void;
  onAddSpouse?: (person: FamilyMember) => void;
  onViewInfo?: (person: FamilyMember) => void;
  onDeletePerson?: (person: FamilyMember) => void;
  onPersonUpdated?: (updatedPerson: FamilyMember) => void;
  // Thêm zoom callbacks
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onZoomCenter?: () => void;
}

interface TreeNode extends FamilyMember {
  x?: number;
  y?: number;
}

const D3FamilyTreeView: React.FC<D3FamilyTreeViewProps> = ({
  treeId,
  zoomLevel = 1,
  onRefresh,
  onNodeClick,
  onAddChild,
  onAddParent,
  onAddSpouse,
  onViewInfo,
  onDeletePerson,
  onPersonUpdated: onPersonUpdatedParent,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomCenter
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0
  });

  // Function to reset node positions (for debugging)
  const resetNodePositions = () => {
    localStorage.removeItem(`tree-positions-${treeId}`);
    loadTreeData();
  };

  // Selected node for operations
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Load tree data from API
  useEffect(() => {
    loadTreeData();
  }, [treeId]);

  // Auto center tree when data is loaded
  useEffect(() => {
    if (treeData && svgRef.current) {
      // Delay to ensure DOM is updated
      const timer = setTimeout(() => {
        centerTreeView();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [treeData]);

  // Function to center the tree view
  const centerTreeView = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      const width = parseInt(svg.attr("width")) || 2000;
      const height = parseInt(svg.attr("height")) || 1200;
      const centerX = width / 2;
      const centerY = height / 2;

      svg.transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.translate(centerX, centerY).scale(1));
    }
  };

  // Expose center function to parent component
  useEffect(() => {
    if (svgRef.current && zoomBehaviorRef.current) {
      (svgRef.current as any).centerTreeView = centerTreeView;
      (svgRef.current as any).zoomIn = handleZoomIn;
      (svgRef.current as any).zoomOut = handleZoomOut;
      (svgRef.current as any).zoomReset = handleZoomReset;
      (svgRef.current as any).zoomCenter = handleZoomCenter;
    }
  }, [treeData, zoomBehaviorRef.current]);

  // Function to enhance tree data with full person info (including death info)
  // Cache updated person data to localStorage
  const cachePersonData = (personId: string, data: any) => {
    const cacheKey = `person_${personId}`;
    try {
      // Get existing cache
      const existingCache = localStorage.getItem(cacheKey);
      let existingData = {};
      if (existingCache) {
        existingData = JSON.parse(existingCache);
      }

      // Merge with new data
      const mergedData = { ...existingData, ...data };
      localStorage.setItem(cacheKey, JSON.stringify(mergedData));
      console.log('D3FamilyTreeView - Cached person data:', personId, mergedData);
    } catch (error) {
      console.error('Failed to cache person data:', error);
    }
  };

  // Function to preprocess tree data - convert children IDs to objects with full relations
  const preprocessTreeData = async (treeData: any, depth: number = 0, maxDepth: number = 3): Promise<any> => {
    if (!treeData || depth >= maxDepth) return treeData;

    console.log(`[PREPROCESS] Depth ${depth} - Processing person: ${treeData.name} (${treeData.id})`);

    const processedData = { ...treeData };

    // Convert children ID strings to full objects with their own relations
    // Use SEQUENTIAL processing instead of Promise.all to avoid cascading failures
    if (treeData.children && Array.isArray(treeData.children) && treeData.children.length > 0) {
      console.log(`[PREPROCESS] Found ${treeData.children.length} children:`, treeData.children);

      const convertedChildren: any[] = [];

      for (let index = 0; index < treeData.children.length; index++) {
        const childIdOrObject = treeData.children[index];

        try {
          if (typeof childIdOrObject === 'string') {
            console.log(`[PREPROCESS] Child ${index}: Converting ID "${childIdOrObject}" to object...`);

            // Get child's full tree relations (includes their spouses and children)
            const childTreeData = await relationService.getPersonTreeRelations(treeId, childIdOrObject);

            if (childTreeData) {
              console.log(`[PREPROCESS] Child ${index} SUCCESS:`, {
                id: childIdOrObject,
                name: childTreeData.name,
                spouses: childTreeData.spouses?.length || 0,
                children: childTreeData.children?.length || 0
              });

              // Recursively process this child's subtree
              const processedChild = await preprocessTreeData(childTreeData, depth + 1, maxDepth);
              convertedChildren.push(processedChild);
            } else {
              // Fallback: get basic person info if tree relations fail
              console.warn(`[PREPROCESS] Child ${index}: Tree relations returned null, using basic info`);
              const childPersonInfo = await personService.getPerson(childIdOrObject);
              convertedChildren.push({
                id: childIdOrObject,
                ...childPersonInfo,
                spouses: [],
                children: []
              });
            }
          } else {
            // Already an object BUT may not have full relations - FETCH THEM!
            console.log(`[PREPROCESS] Child ${index}: Already object (${childIdOrObject.name}), fetching relations...`);

            try {
              // Even if it's an object, we need to get full relations from API
              const childTreeData = await relationService.getPersonTreeRelations(treeId, childIdOrObject.id);

              if (childTreeData) {
                console.log(`[PREPROCESS] Child ${index} relations fetched:`, {
                  id: childIdOrObject.id,
                  name: childTreeData.name,
                  spouses: childTreeData.spouses?.length || 0,
                  children: childTreeData.children?.length || 0
                });
                console.log(`[PREPROCESS] Full childTreeData:`, childTreeData);
                console.log(`[PREPROCESS] childTreeData.spouses:`, childTreeData.spouses);
                console.log(`[PREPROCESS] childTreeData.children:`, childTreeData.children);

                // Merge existing data with fetched relations
                const mergedChild = {
                  ...childIdOrObject,
                  spouses: childTreeData.spouses || [],
                  children: childTreeData.children || []
                };

                console.log(`[PREPROCESS] Merged child BEFORE recursion:`, {
                  id: mergedChild.id,
                  name: mergedChild.name,
                  spousesCount: mergedChild.spouses?.length || 0,
                  childrenCount: mergedChild.children?.length || 0
                });

                // Recursively process this child's subtree
                const processedChild = await preprocessTreeData(mergedChild, depth + 1, maxDepth);

                console.log(`[PREPROCESS] Processed child AFTER recursion:`, {
                  id: processedChild.id,
                  name: processedChild.name,
                  spousesCount: processedChild.spouses?.length || 0,
                  childrenCount: processedChild.children?.length || 0
                });

                convertedChildren.push(processedChild);
              } else {
                console.warn(`[PREPROCESS] Child ${index}: Could not fetch relations, using existing data`);
                const processedChild = await preprocessTreeData(childIdOrObject, depth + 1, maxDepth);
                convertedChildren.push(processedChild);
              }
            } catch (error) {
              console.error(`[PREPROCESS] Child ${index}: Failed to fetch relations`, error);
              // Fallback to existing object
              const processedChild = await preprocessTreeData(childIdOrObject, depth + 1, maxDepth);
              convertedChildren.push(processedChild);
            }
          }
        } catch (error) {
          console.error(`[PREPROCESS] Child ${index} FAILED:`, childIdOrObject, error);
          // Add minimal fallback so rendering doesn't break completely
          convertedChildren.push({
            id: typeof childIdOrObject === 'string' ? childIdOrObject : (childIdOrObject?.id || `error-${index}`),
            name: typeof childIdOrObject === 'object' ? (childIdOrObject?.name || 'Error') : 'Loading...',
            gender: 'M',
            birthday: '2000-01-01',
            generation: depth + 1,
            spouses: [],
            children: []
          });
        }
      }

      processedData.children = convertedChildren;
      console.log(`[PREPROCESS] Converted ${convertedChildren.length} children complete:`,
        convertedChildren.map(c => ({ id: c.id, name: c.name, hasSpouses: c.spouses?.length, hasChildren: c.children?.length })));
    }

    // Process spouses (convert IDs to objects if needed) - SEQUENTIAL processing
    if (treeData.spouses && Array.isArray(treeData.spouses) && treeData.spouses.length > 0) {
      console.log(`[PREPROCESS] Found ${treeData.spouses.length} spouses`);

      const convertedSpouses: any[] = [];

      for (let index = 0; index < treeData.spouses.length; index++) {
        const spouse = treeData.spouses[index];

        try {
          if (typeof spouse === 'string') {
            console.log(`[PREPROCESS] Spouse ${index}: Converting ID "${spouse}" to object...`);
            const spousePersonInfo = await personService.getPerson(spouse);
            convertedSpouses.push({
              id: spouse,
              ...spousePersonInfo,
              spouses: [],
              children: []
            });
            console.log(`[PREPROCESS] Spouse ${index} SUCCESS: ${spousePersonInfo.name}`);
          } else {
            // Already an object
            convertedSpouses.push(spouse);
            console.log(`[PREPROCESS] Spouse ${index}: Already object (${spouse.name})`);
          }
        } catch (error) {
          console.error(`[PREPROCESS] Spouse ${index} FAILED:`, spouse, error);
          convertedSpouses.push({
            id: typeof spouse === 'string' ? spouse : (spouse?.id || `error-spouse-${index}`),
            name: 'Error loading',
            gender: 'F',
            birthday: '2000-01-01',
            generation: depth,
            spouses: [],
            children: []
          });
        }
      }

      processedData.spouses = convertedSpouses;
      console.log(`[PREPROCESS] Converted ${convertedSpouses.length} spouses complete`);
    }

    console.log(`[PREPROCESS] Depth ${depth} COMPLETE for ${treeData.name}`);
    return processedData;
  }; const enhanceTreeDataWithPersonInfo = async (treeData: any): Promise<any> => {
    if (!treeData) return treeData;

    try {
      // Get cached data for this person (if exists)
      const cacheKey = `person_${treeData.id}`;
      const cachedData = localStorage.getItem(cacheKey);
      let cachedPersonInfo = null;
      if (cachedData) {
        try {
          cachedPersonInfo = JSON.parse(cachedData);
          console.log('D3FamilyTreeView - Found cached data for person:', treeData.id, cachedPersonInfo);
        } catch (e) {
          console.warn('Failed to parse cached data for person:', treeData.id);
        }
      } else {
        console.log('D3FamilyTreeView - No cached data found for person:', treeData.id);
      }

      // Get full info for root person
      const rootPersonInfo = await personService.getPerson(treeData.id);
      console.log('D3FamilyTreeView - Root person full info:', rootPersonInfo);
      console.log('D3FamilyTreeView - birthPlace from API:', rootPersonInfo.birthPlace);
      console.log('D3FamilyTreeView - Original treeData birthPlace:', treeData.birthPlace);

      // Enhance root person with additional info but preserve original structure
      const enhancedRoot = {
        ...treeData, // Keep ALL original properties first
        // Only add/override specific fields
        deathPlace: cachedPersonInfo?.deathPlace || rootPersonInfo.deathPlace || treeData.deathPlace,
        gravePlace: cachedPersonInfo?.gravePlace || rootPersonInfo.gravePlace || treeData.gravePlace,
        deathDate: cachedPersonInfo?.deathDate || rootPersonInfo.deathDate || treeData.deathDate,
        birthPlace: cachedPersonInfo?.birthPlace || rootPersonInfo.birthPlace || treeData.birthPlace,
        avatarUrl: cachedPersonInfo?.avatarUrl || rootPersonInfo.avatarUrl || treeData.avatarUrl,
        // CRITICAL FIX: Also restore spouses/children from cache if available!
        spouses: cachedPersonInfo?.spouses || treeData.spouses || [],
        children: cachedPersonInfo?.children || treeData.children || []
      };

      console.log('D3FamilyTreeView - Enhanced root with cache priority:', {
        id: treeData.id,
        name: treeData.name,
        birthPlace: enhancedRoot.birthPlace,
        deathPlace: enhancedRoot.deathPlace,
        deathDate: enhancedRoot.deathDate,
        spousesCount: enhancedRoot.spouses?.length || 0,
        childrenCount: enhancedRoot.children?.length || 0,
        cached: cachedPersonInfo,
        api: rootPersonInfo
      });

      // Enhance spouses if any
      if (treeData.spouses && treeData.spouses.length > 0) {
        const enhancedSpouses = await Promise.all(
          treeData.spouses.map(async (spouse: any) => {
            if (spouse.id) {
              // Get cached data for spouse
              const spouseCacheKey = `person_${spouse.id}`;
              const spouseCachedData = localStorage.getItem(spouseCacheKey);
              let spouseCachedInfo = null;
              if (spouseCachedData) {
                try {
                  spouseCachedInfo = JSON.parse(spouseCachedData);
                } catch (e) {
                  console.warn('Failed to parse cached data for spouse:', spouse.id);
                }
              }

              const spouseInfo = await personService.getPerson(spouse.id);
              return {
                ...spouse, // Keep ALL original spouse properties
                // Only add/override specific fields
                deathPlace: spouseCachedInfo?.deathPlace || spouseInfo.deathPlace || spouse.deathPlace,
                gravePlace: spouseCachedInfo?.gravePlace || spouseInfo.gravePlace || spouse.gravePlace,
                deathDate: spouseCachedInfo?.deathDate || spouseInfo.deathDate || spouse.deathDate,
                birthPlace: spouseCachedInfo?.birthPlace || spouseInfo.birthPlace || spouse.birthPlace,
                avatarUrl: spouseCachedInfo?.avatarUrl || spouseInfo.avatarUrl || spouse.avatarUrl,
                // CRITICAL FIX: Also restore spouses/children from cache for spouse!
                spouses: spouseCachedInfo?.spouses || spouse.spouses || [],
                children: spouseCachedInfo?.children || spouse.children || []
              };
            }
            return spouse;
          })
        );
        enhancedRoot.spouses = enhancedSpouses;
      }

      // Recursively enhance children (already preprocessed with full structure)
      if (treeData.children && Array.isArray(treeData.children)) {
        enhancedRoot.children = await Promise.all(
          treeData.children.map(async (child: any) => {
            if (!child.id) return child;

            // Get cached data for this child
            const childCacheKey = `person_${child.id}`;
            const childCachedData = localStorage.getItem(childCacheKey);
            let childCachedInfo = null;
            if (childCachedData) {
              try {
                childCachedInfo = JSON.parse(childCachedData);
              } catch (e) {
                console.warn('Failed to parse cached data for child:', child.id);
              }
            }

            // Get person info for this child
            const childPersonInfo = await personService.getPerson(child.id);

            // Enhance with cached data priority
            const enhancedChild = {
              ...child,
              deathPlace: childCachedInfo?.deathPlace || childPersonInfo.deathPlace || child.deathPlace,
              gravePlace: childCachedInfo?.gravePlace || childPersonInfo.gravePlace || child.gravePlace,
              deathDate: childCachedInfo?.deathDate || childPersonInfo.deathDate || child.deathDate,
              birthPlace: childCachedInfo?.birthPlace || childPersonInfo.birthPlace || child.birthPlace,
              avatarUrl: childCachedInfo?.avatarUrl || childPersonInfo.avatarUrl || child.avatarUrl,
              // CRITICAL FIX: Also restore spouses/children from cache for child!
              spouses: childCachedInfo?.spouses || child.spouses || [],
              children: childCachedInfo?.children || child.children || []
            };

            // Recursively enhance this child's subtree
            return await enhanceTreeDataWithPersonInfo(enhancedChild);
          })
        );
      }

      return enhancedRoot;
    } catch (error) {
      console.error('Error enhancing tree data:', error);
      return treeData; // Return original if enhancement fails
    }
  };

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Debug: Check all cached person data on page load
      console.log('D3FamilyTreeView - F5 Debug: Checking localStorage...');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('person_')) {
          const value = localStorage.getItem(key);
          console.log(`D3FamilyTreeView - F5 Debug: ${key} =`, JSON.parse(value || '{}'));
        }
      }

      console.log('D3FamilyTreeView - Loading tree data for treeId:', treeId);
      const result = await relationService.getTreeRelations(treeId);
      console.log('D3FamilyTreeView - Tree data loaded:', result);

      if (result.code === 200) {
        console.log('D3FamilyTreeView - Step 1: Starting preprocess...');

        // Step 1: Preprocess - convert children IDs to objects  
        const preprocessedData = await preprocessTreeData(result.data);
        console.log('D3FamilyTreeView - Step 1 COMPLETE: Preprocessed data:', preprocessedData);
        console.log('D3FamilyTreeView - Preprocessed root spouses:', preprocessedData.spouses);
        console.log('D3FamilyTreeView - Preprocessed root children:', preprocessedData.children);

        console.log('D3FamilyTreeView - Step 2: Starting enhancement...');

        // Step 2: Enhancement - add person info and cache
        const enhancedTreeData = await enhanceTreeDataWithPersonInfo(preprocessedData);
        console.log('D3FamilyTreeView - Step 2 COMPLETE: Enhanced TreeData:', enhancedTreeData);
        console.log('D3FamilyTreeView - Enhanced root spouses:', enhancedTreeData.spouses);
        console.log('D3FamilyTreeView - Enhanced root children:', enhancedTreeData.children);

        setTreeData(enhancedTreeData);
        console.log('D3FamilyTreeView - TreeData SET to state successfully');

        // Debug: Kiểm tra thông tin mất của từng node sau khi enhance
        if (result.data) {
          console.log('D3FamilyTreeView - Root person death info (original):', {
            name: result.data.name,
            deathPlace: result.data.deathPlace,
            gravePlace: result.data.gravePlace,
            deathDate: result.data.deathDate
          });
        }
      } else {
        setError(result.message || 'Lỗi tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      console.error('Error loading tree data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonUpdated = (updatedPerson: FamilyMember) => {
    console.log('[handlePersonUpdated] Updating person:', updatedPerson.id, updatedPerson.name);
    console.log('[handlePersonUpdated] Updated fields:', updatedPerson);

    setTreeData(prevData => {
      if (!prevData) return prevData;

      const updatePersonInTree = (person: FamilyMember): FamilyMember => {
        if (person.id === updatedPerson.id) {
          // CRITICAL: Merge with existing person to preserve spouses/children
          const mergedPerson = {
            ...person,
            ...updatedPerson,
            // MUST preserve relationships from existing state
            spouses: updatedPerson.spouses || person.spouses || [],
            children: updatedPerson.children || person.children || []
          };

          console.log('[handlePersonUpdated] Merging person:', {
            id: mergedPerson.id,
            name: mergedPerson.name,
            spousesCount: mergedPerson.spouses?.length || 0,
            childrenCount: mergedPerson.children?.length || 0,
            deathDate: mergedPerson.deathDate,
            deathPlace: mergedPerson.deathPlace
          });

          // Cache COMPLETE person data including relationships
          cachePersonData(mergedPerson.id, {
            deathPlace: mergedPerson.deathPlace,
            gravePlace: mergedPerson.gravePlace,
            deathDate: mergedPerson.deathDate,
            birthPlace: mergedPerson.birthPlace,
            avatarUrl: mergedPerson.avatarUrl,
            // Cache relationships so they survive F5
            spouses: mergedPerson.spouses,
            children: mergedPerson.children
          });

          return mergedPerson;
        }

        const updatedChildren = person.children?.map(updatePersonInTree) || [];
        const updatedSpouses = person.spouses?.map(updatePersonInTree) || [];

        return {
          ...person,
          children: updatedChildren,
          spouses: updatedSpouses
        };
      };

      const result = updatePersonInTree(prevData);
      return result;
    });

    // Notify parent component about the update
    onPersonUpdatedParent?.(updatedPerson);
  };

  // D3 tree rendering với SVG đẹp hơn
  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    const width = 2000;
    const height = 1200;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "grab");

    svg.selectAll("*").remove();

    // Tạo shadow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter.append("feDropShadow")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("stdDeviation", 3)
      .attr("flood-color", "rgba(0,0,0,0.3)");

    // Nhóm chính để hỗ trợ zoom/pan
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("start", function () {
        d3.select(this).style("cursor", "grabbing");
      })
      .on("zoom", (event) => {
        svgMain.attr("transform", event.transform);
      })
      .on("end", function () {
        d3.select(this).style("cursor", "grab");
      });

    // Store zoom behavior for external control
    zoomBehaviorRef.current = zoomBehavior;

    const svgGroup = svg.call(zoomBehavior).append("g");

    // Tính toán vị trí trung tâm - căn giữa cây gia phả
    const centerX = width / 2;
    const centerY = height / 2;

    // Luôn bắt đầu với vị trí trung tâm để đảm bảo cây hiển thị ở giữa
    const initialTransform = `translate(${centerX}, ${centerY}) scale(1)`;

    const svgMain = svgGroup.append("g").attr("transform", initialTransform);

    console.log('[D3 Render] START - TreeData structure:', {
      id: treeData.id,
      name: treeData.name,
      spousesCount: treeData.spouses?.length || 0,
      childrenCount: treeData.children?.length || 0
    });

    console.log('[D3 Render] Root spouses:', treeData.spouses?.map((s: any) => ({
      id: s?.id,
      name: s?.name,
      type: typeof s
    })));

    console.log('[D3 Render] Root children:', treeData.children?.map((c: any) => ({
      id: c?.id,
      name: c?.name,
      type: typeof c,
      hasSpouses: c?.spouses?.length || 0,
      hasChildren: c?.children?.length || 0
    })));

    // Thu thập node/link theo thuật toán trong file HTML
    const allNodes: Array<TreeNode & { x: number; y: number; generation: number }> = [];
    const spouseLinks: Array<{ source: { x: number; y: number }; target: { x: number; y: number } }> = [];
    const parentChildLinks: Array<{ source: { x: number; y: number }; target: { x: number; y: number } }> = [];

    const nodeWidth = 200;
    const nodeHeight = 90;
    const spouseSpacing = 240;
    const generationSpacing = 180;

    function getCombinedChildren(person: TreeNode): TreeNode[] {
      console.log('[getCombinedChildren] Person:', person.name, {
        directChildren: person.children?.length || 0,
        spouses: person.spouses?.length || 0
      });

      const directChildren = (person.children || []) as TreeNode[];
      console.log('[getCombinedChildren] Direct children:', directChildren.map((c: any) => ({
        id: c?.id,
        name: c?.name,
        type: typeof c
      })));

      const spouseChildrenArrays = (person.spouses || []).map((s: any) => (s.children || []) as TreeNode[]);
      const combined = [...directChildren, ...spouseChildrenArrays.flat()];

      console.log('[getCombinedChildren] Combined children count:', combined.length);

      const uniqueById = new Map<string, TreeNode>();
      combined.forEach((child: any) => {
        if (child && child.id && !uniqueById.has(child.id)) {
          uniqueById.set(child.id, child as TreeNode);
        }
      });

      // REMOVED SORTING to preserve original order and positions
      const result = Array.from(uniqueById.values());

      console.log('[getCombinedChildren] Final unique children (NO SORTING):', result.map(c => ({ id: c.id, name: c.name })));
      return result;
    }

    function calculateSubtreeWidth(person: TreeNode): number {
      const spouseSpacing = 500;
      const minChildSpacing = 300;
      const spouses = person.spouses || [];
      const children = getCombinedChildren(person);
      const selfWidth = nodeWidth + spouses.length * spouseSpacing;

      if (children.length === 0) return Math.max(selfWidth, minChildSpacing);

      let childrenTotal = 0;
      children.forEach((c) => {
        childrenTotal += calculateSubtreeWidth(c as TreeNode);
      });
      return Math.max(selfWidth, childrenTotal);
    }

    // Load saved positions from localStorage
    const savedPositions = localStorage.getItem(`tree-positions-${treeId}`);
    const savedPositionMap: Record<string, { x: number; y: number }> = savedPositions ? JSON.parse(savedPositions) : {};

    function calculatePositions(person: TreeNode, x = 0, y = 0, generation = 0) {
      // Use saved position if available, otherwise use calculated position
      const nodeId = person.id;
      let nodeX = x;
      let nodeY = y;

      if (savedPositionMap[nodeId]) {
        nodeX = savedPositionMap[nodeId].x;
        nodeY = savedPositionMap[nodeId].y;
      } else {
        // Save new position for future use
        savedPositionMap[nodeId] = { x: nodeX, y: nodeY };
      }

      const mainNode = { ...(person as any), x: nodeX, y: nodeY, generation } as TreeNode & {
        x: number;
        y: number;
        generation: number;
      };
      allNodes.push(mainNode);

      // Vẽ spouse ngang - maintain saved positions
      const spouses = person.spouses || [];
      console.log('[calculatePositions] Spouses (NO SORTING):', {
        person: person.name,
        count: spouses.length,
        spouses: spouses.map((s: any) => ({
          id: s.id,
          name: s.name,
          deathDate: s.deathDate
        }))
      });

      spouses.forEach((spouse: any, index: number) => {
        const spouseId = spouse.id;
        let spouseX = nodeX + (index + 1) * spouseSpacing;
        let spouseY = nodeY;

        // Use saved position if available
        if (savedPositionMap[spouseId]) {
          spouseX = savedPositionMap[spouseId].x;
          spouseY = savedPositionMap[spouseId].y;
        } else {
          // Save new position
          savedPositionMap[spouseId] = { x: spouseX, y: spouseY };
        }

        const spouseNode = { ...(spouse as any), x: spouseX, y: spouseY, generation };
        allNodes.push(spouseNode);

        // Tạo liên kết vợ/chồng
        spouseLinks.push({
          source: { x: nodeX, y: nodeY },
          target: { x: spouseX, y: spouseY }
        });

        console.log('Creating spouse link:', {
          source: { x: nodeX, y: nodeY },
          target: { x: spouseX, y: spouseY },
          spouse: spouse.name
        });
      });

      // Tính vị trí trung tâm cha mẹnpm
      let parentCenterX = nodeX;
      if (spouses.length > 0) {
        // CRITICAL FIX: Get the ACTUAL last spouse X from the spouse that was just added to allNodes
        // This ensures we use the real rendered position, not cached position
        const lastSpouseInNodes = allNodes[allNodes.length - 1]; // Last spouse just added
        const lastSpouseX = lastSpouseInNodes.x;

        parentCenterX = (nodeX + lastSpouseX) / 2;

        console.log('[calculatePositions] Parent center calculation:', {
          person: person.name,
          nodeX,
          lastSpouseX,
          parentCenterX,
          spousesCount: spouses.length,
          lastSpouseName: lastSpouseInNodes.name
        });
      }

      // Vẽ các node con căn giữa dưới cha mẹ
      const children = getCombinedChildren(person);
      if (children.length > 0) {
        const childY = nodeY + generationSpacing;
        const childWidths = children.map((c) => calculateSubtreeWidth(c as TreeNode));
        const totalChildrenWidth = childWidths.reduce((s, w) => s + w, 0);
        let startX = parentCenterX - totalChildrenWidth / 2;

        children.forEach((child: any, idx: number) => {
          const calculatedChildCenterX = startX + childWidths[idx] / 2;
          const childId = child.id;

          // CRITICAL FIX: Always use calculated position for children to center them under parents
          // Don't use savedPositionMap for children - only for root and spouses
          let childCenterX = calculatedChildCenterX;
          let childCenterY = childY;

          // Save new position for this render
          savedPositionMap[childId] = { x: childCenterX, y: childCenterY };

          // Tạo liên kết từ dưới card cha mẹ xuống con
          const link = {
            source: { x: parentCenterX, y: nodeY + nodeHeight / 50 },
            target: { x: childCenterX, y: childCenterY - nodeHeight / 10 }
          };

          parentChildLinks.push(link);

          console.log('[parentChildLink] Creating link:', {
            parent: person.name,
            child: child.name,
            parentCenterX,
            childCenterX,
            link
          });

          calculatePositions(child as TreeNode, childCenterX, childCenterY, generation + 1);
          startX += childWidths[idx];
        });
      }
    }    // Bắt đầu tính toán từ vị trí (0, 0) để cây được căn giữa tự nhiên
    calculatePositions(treeData as TreeNode, 0, 0);

    // Save all positions to localStorage for persistence across refreshes
    localStorage.setItem(`tree-positions-${treeId}`, JSON.stringify(savedPositionMap));

    // Vẽ liên kết vợ/chồng
    svgMain.selectAll(".spouse-link")
      .data(spouseLinks)
      .enter()
      .append("line")
      .attr("class", "spouse-link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "#FFBA9D") // đổi sang màu cam
      .attr("stroke-width", 3);

    // Vẽ liên kết cha mẹ-con cái với dấu cộng như trong hình
    svgMain.selectAll(".parent-child-link")
      .data(parentChildLinks)
      .enter()
      .append("path")
      .attr("class", "parent-child-link")
      .attr("d", d => {
        const midY = (d.source.y + d.target.y) / 2;

        return `M ${d.source.x},${d.source.y} 
               L ${d.source.x},${midY} 
               L ${d.target.x},${midY} 
               L ${d.target.x},${d.target.y}`;
      })
      .attr("fill", "none")
      .attr("stroke", "#FFBA9D") // đổi sang màu cam
      .attr("stroke-width", 3);

    // Vẽ node với hiệu ứng đẹp
    const nodeGroup = svgMain
      .selectAll(".node")
      .data(allNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${isNaN(d.x) ? 0 : d.x},${isNaN(d.y) ? 0 : d.y})`)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("rect")
          .transition()
          .style("filter", "drop-shadow(0 0 10px rgba(0, 0, 0, 0.2))");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .attr("stroke-width", 2)
          .attr("stroke", (d: any) => {


            // Kiểm tra nếu người đó đã mất (có deathPlace, gravePlace hoặc deathDate)
            if (d.deathPlace || d.gravePlace || d.deathDate) {
              return "#9CA3AF"; // màu xám nhạt cho người đã mất
            }
            // Màu theo giới tính cho người còn sống
            return d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333";
          })
          .style("filter", "none");
      })
      .on("click", function (event, d: any) {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d as FamilyMember);
        }
      });

    // Vẽ background cho node - card layout ngang
    nodeGroup
      .append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "#fff")
      .attr("stroke", (d: any) => {
        // Kiểm tra nếu người đó đã mất (có deathPlace, gravePlace hoặc deathDate)
        if (d.deathPlace || d.gravePlace || d.deathDate) {
          return "#9CA3AF"; // màu xám nhạt cho người đã mất
        }
        // Màu theo giới tính cho người còn sống
        return d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333";
      })
      .attr("stroke-width", 2)
      .attr("filter", "url(#shadow)");

    // Avatar circle - bên trái
    nodeGroup
      .append("circle")
      .attr("cx", -nodeWidth / 2 + 35)
      .attr("cy", 0)
      .attr("r", 28)
      .attr("fill", "#f3f4f6")
      .attr("stroke", (d: any) => {
        // Kiểm tra nếu người đó đã mất (có deathPlace, gravePlace hoặc deathDate)
        if (d.deathPlace || d.gravePlace || d.deathDate) {
          return "#9CA3AF"; // màu xám nhạt cho người đã mất
        }
        // Màu theo giới tính cho người còn sống
        return d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#e5e7eb";
      })
      .attr("stroke-width", 1);

    // Avatar image
    nodeGroup
      .append("image")
      .attr("href", (d: any) => getPersonAvatar({
        gender: d.gender,
        avatarUrl: d.avatarUrl,
        birthday: d.birthday,
        generation: d.generation
      }))
      .attr("x", -nodeWidth / 2 + 7)
      .attr("y", -28)
      .attr("width", 56)
      .attr("height", 56)
      .attr("clip-path", "circle(28px at 28px 28px)")
      .style("cursor", "pointer")
      .on("click", function (event, d: any) {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d as FamilyMember);
        }
      });

    // Camera icon - góc phải dưới của avatar
    const iconSize = 21;

    nodeGroup
      .append("image")
      .attr("href", cameraIcon)
      .attr("x", -nodeWidth / 2 + 45 + 15 - iconSize / 2)
      .attr("y", 19 + 5 - 15 - iconSize / 21)
      .attr("width", iconSize)
      .attr("height", iconSize)
      .style("cursor", "pointer");

    // Tên người - bên phải avatar
    nodeGroup
      .append("text")
      .attr("x", -20)
      .attr("y", -8)
      .attr("text-middle", "start")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .style("fill", "#1f2937")
      .text((d: any) => d.name || "");

    // Thông tin phụ (giới tính, năm sinh)
    nodeGroup
      .append("text")
      .attr("x", -20)
      .attr("y", 8)
      .attr("text-middle", "start")
      .style("font-size", "12px")
      .style("fill", "#6b7280")
      .text((d: any) => {
        const genderText = d.gender === "M" ? "Nam" : d.gender === "F" ? "Nữ" : "";
        const birthDateText = formatDateCompact(d.birthday);

        if (birthDateText) {
          return `${genderText}, ${birthDateText}`;
        } else {
          return genderText || "Không rõ";
        }
      });

    // Nút dấu cộng ở dưới node (cho context menu)
    nodeGroup
      .append("path")
      .attr("d", `
     M -40 0
     Q -16 14 -10 16
     Q 0 18 10 16
     Q 16 14 40 0
     Z
  `)
      .attr("transform", `translate(0, ${nodeHeight / 2 + 0.3})`)
      .attr("fill", "#fff")
      .attr("stroke-width", 2)
      .attr("filter", "url(#shadow)")
      .style("cursor", "pointer")
      .on("click", function (event, d: any) {
        event.stopPropagation();
        setSelectedNode(d as any);

        // Gọi callback để hiển thị thông tin node trên sidebar
        if (onNodeClick) {
          onNodeClick(d as FamilyMember);
        }

        const svgElement = svgRef.current;
        const svgRect = svgElement?.getBoundingClientRect();
        if (svgRect) {
          const x = event.clientX - svgRect.left;
          const y = event.clientY - svgRect.top;
          setContextMenu({ isVisible: true, x, y });
        }
      });

    // Vẽ dấu cộng bên trong circle
    nodeGroup
      .append("text")
      .attr("x", 0)
      .attr("y", nodeHeight / 2 + 16)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", "#152238")
      .text("+")
      .style("pointer-events", "none");

  }, [treeData, zoomLevel]);

  // Handle context menu actions
  const handleAddChild = () => {
    if (selectedNode && onAddChild) {
      onAddChild(selectedNode);
    }
  };

  const handleAddParent = () => {
    if (selectedNode && onAddParent) {
      onAddParent(selectedNode);
    }
  };

  const handleAddSpouse = () => {
    if (selectedNode && onAddSpouse) {
      onAddSpouse(selectedNode);
    }
  };

  const handleViewInfo = () => {
    if (selectedNode && onViewInfo && treeData) {
      console.log('[handleViewInfo] START - Selected node:', selectedNode.id, selectedNode.name);
      console.log('[handleViewInfo] Current treeData:', treeData);

      // Find the full node data from treeData instead of using selectedNode
      const findNodeInTree = (node: any, targetId: string): any => {
        if (node.id === targetId) {
          console.log('[findNodeInTree] FOUND target node:', {
            id: node.id,
            name: node.name,
            hasSpouses: node.spouses?.length || 0,
            hasChildren: node.children?.length || 0
          });
          return node;
        }

        // Search in children
        if (node.children && Array.isArray(node.children)) {
          for (const child of node.children) {
            const found = findNodeInTree(child, targetId);
            if (found) return found;
          }
        }

        // Search in spouses
        if (node.spouses && Array.isArray(node.spouses)) {
          for (const spouse of node.spouses) {
            const found = findNodeInTree(spouse, targetId);
            if (found) return found;
          }
        }

        return null;
      };

      const fullNodeData = findNodeInTree(treeData, selectedNode.id);
      console.log('[handleViewInfo] Search result:', fullNodeData);

      if (fullNodeData) {
        console.log('[handleViewInfo] Using full node data with relationships');
        onViewInfo(fullNodeData);
      } else {
        console.warn('[handleViewInfo] Node not found in tree, using selectedNode');
        onViewInfo(selectedNode);
      }
    }
  }; const handleDelete = () => {
    if (selectedNode && onDeletePerson) {
      onDeletePerson(selectedNode);
    }
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.2);
    }
    if (onZoomIn) onZoomIn();
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.8);
    }
    if (onZoomOut) onZoomOut();
  };

  const handleZoomReset = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      const width = parseInt(svg.attr("width")) || 2000;
      const height = parseInt(svg.attr("height")) || 1200;
      const centerX = width / 2;
      const centerY = height / 2;

      svg.transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.translate(centerX, centerY).scale(1));
    }
    if (onZoomReset) onZoomReset();
  };

  const handleZoomCenter = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      const width = parseInt(svg.attr("width")) || 2000;
      const height = parseInt(svg.attr("height")) || 1200;
      const centerX = width / 2;
      const centerY = height / 2;

      // Get current scale
      const currentTransform = d3.zoomTransform(svgRef.current);

      svg.transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.translate(centerX, centerY).scale(currentTransform.k));
    }
    if (onZoomCenter) onZoomCenter();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải cây gia phả...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadTreeData}
            className="px-4 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* D3 SVG Container with Context Menu */}
      <div
        className="border border-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center cursor-grab hover:cursor-grab active:cursor-grabbing"
        style={{ background: '#e5e7eb', minHeight: '700px' }}
      >
        <svg
          ref={svgRef}
          width="1800"
          height="1200"
          className="family-tree-svg"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', background: '#e5e7eb', borderRadius: '0.75rem' }}
        />

        <ContextMenu
          isVisible={contextMenu.isVisible}
          x={contextMenu.x}
          y={contextMenu.y}
          selectedPerson={selectedNode}
          onAddChild={handleAddChild}
          onAddParent={handleAddParent}
          onAddSpouse={handleAddSpouse}
          onViewInfo={handleViewInfo}
          onDelete={handleDelete}
          onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
          onRefresh={loadTreeData}
          onPersonUpdated={handlePersonUpdated}
        />
      </div>
    </div>
  );
};

export default D3FamilyTreeView;