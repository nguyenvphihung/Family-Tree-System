import React, { Children, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../../types/family';
import familyService from '../../services/familyService';
import AddChildModal from './AddChildModal';
import AddParentModal from './AddParentModal';
import AddSpouseModal from './AddSpouseModal';
import PersonInfoModal from './PersonInfoModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ContextMenu from './ContextMenu';

interface D3FamilyTreeViewProps {
  treeId: string
  personId: string;
  zoomLevel?: number;
  onRefresh?: () => void;
}

interface TreeNode extends FamilyMember {
  x?: number;
  y?: number;
}

const D3FamilyTreeView: React.FC<D3FamilyTreeViewProps> = ({
  treeId,
  personId,
  zoomLevel = 1,
  onRefresh
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddSpouseModal, setShowAddSpouseModal] = useState(false);
  const [showPersonInfoModal, setShowPersonInfoModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0
  });

  // Selected node for operations
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Load tree data from API
  useEffect(() => {
    loadTreeData();
  }, [treeId, personId]);

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await familyService.getPersonWithRelations(treeId, personId);
      if (result.code === 200) {
        setTreeData(result.data);
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

  // D3 tree rendering với SVG đẹp hơn
  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", "-240 0 3400 2000") // chỉnh kích thước vùng hiển thị
      .attr("preserveAspectRatio", "xMidYMid meet");;
    svg.selectAll("*").remove();

    const width = 2000;
    const height = 1200;

    // Tạo gradient definitions
    const defs = svg.append("defs");

    // Gradient cho node nam
    const maleGradient = defs.append("linearGradient")
      .attr("id", "maleGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    maleGradient.append("stop").attr("offset", "0%").attr("stop-color", "#708090");
    maleGradient.append("stop").attr("offset", "100%").attr("stop-color", "#708090");

    // Gradient cho node nữ
    const femaleGradient = defs.append("linearGradient")
      .attr("id", "femaleGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    femaleGradient.append("stop").attr("offset", "0%").attr("stop-color", "#708090");
    femaleGradient.append("stop").attr("offset", "100%").attr("stop-color", "#708090");

    // Filter cho shadow
    const filter = defs.append("filter")
      .attr("id", "shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter.append("feDropShadow")
      .attr("dx", "2")
      .attr("dy", "2")
      .attr("stdDeviation", "3")
      .attr("flood-color", "rgba(0,0,0,0.3)");

    // Nhóm chính để hỗ trợ zoom/pan
    const svgGroup = svg
      .attr("width", width)
      .attr("height", height)
      .call(
        d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.2, 3])
          .on("zoom", (event) => svgMain.attr("transform", event.transform))
      )
      .append("g");

    const svgMain = svgGroup.append("g").attr("transform", "translate(100,50)");

    // Thu thập node/link theo thuật toán trong file HTML
    const allNodes: Array<TreeNode & { x: number; y: number; generation: number }> = [];
    const spouseLinks: Array<{ source: { x: number; y: number }; target: { x: number; y: number } }> = [];
    const parentChildLinks: Array<{ source: { x: number; y: number }; target: { x: number; y: number } }> = [];

    const nodeWidth = 160;
    const nodeHeight = 90;
    const spouseSpacing = 220;
    const generationSpacing = 180;

    function getCombinedChildren(person: TreeNode): TreeNode[] {
      const directChildren = (person.children || []) as TreeNode[];
      const spouseChildrenArrays = (person.spouses || []).map((s: any) => (s.children || []) as TreeNode[]);
      const combined = [...directChildren, ...spouseChildrenArrays.flat()];
      const uniqueById = new Map<string, TreeNode>();
      combined.forEach((child: any) => {
        if (child && child.id && !uniqueById.has(child.id)) {
          uniqueById.set(child.id, child as TreeNode);
        }
      });
      return Array.from(uniqueById.values());
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

    function calculatePositions(person: TreeNode, x = width / 2, y = 100, generation = 0) {
      const mainNode = { ...(person as any), x, y, generation } as TreeNode & {
        x: number;
        y: number;
        generation: number;
      };
      allNodes.push(mainNode);

      // Vẽ spouse ngang
      const spouses = person.spouses || [];
      spouses.forEach((spouse: any, index: number) => {
        const spouseX = x + (index + 1) * spouseSpacing;
        const spouseNode = { ...(spouse as any), x: spouseX, y, generation };
        allNodes.push(spouseNode);

        // Tạo liên kết vợ/chồng
        spouseLinks.push({
          source: { x, y },
          target: { x: spouseX, y }
        });
      });

      // Tính vị trí trung tâm cha mẹ
      let parentCenterX = x;
      if (spouses.length > 0) {
        const lastSpouseX = x + spouses.length * spouseSpacing;
        parentCenterX = (x + lastSpouseX) / 2;
      }

      // Vẽ các node con căn giữa dưới cha mẹ
      const children = getCombinedChildren(person);
      if (children.length > 0) {
        const childY = y + generationSpacing;
        const childWidths = children.map((c) => calculateSubtreeWidth(c as TreeNode));
        const totalChildrenWidth = childWidths.reduce((s, w) => s + w, 0);
        let startX = parentCenterX - totalChildrenWidth / 2;

        children.forEach((child: any, idx: number) => {
          const childCenterX = startX + childWidths[idx] / 2;

          // Tạo liên kết từ trung tâm cha mẹ xuống con
          parentChildLinks.push({
            source: { x: parentCenterX, y: y + nodeHeight / 2 - 46 },
            target: { x: childCenterX, y: childY - nodeHeight / 2 }
          });

          calculatePositions(child as TreeNode, childCenterX, childY, generation + 1);
          startX += childWidths[idx];
        });
      }
    }

    calculatePositions(treeData as TreeNode);

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
      .attr("stroke", "#708090")
      .attr("stroke-width", 3);

    // Vẽ liên kết cha mẹ-con cái
    svgMain.selectAll(".parent-child-link")
      .data(parentChildLinks)
      .enter()
      .append("path")
      .attr("class", "parent-child-link")
      .attr("d", d => {
        const intermediateY = d.source.y + 86;
        const targetTopY = d.target.y;

        return `M ${d.source.x},${d.source.y} 
               L ${d.source.x},${intermediateY} 
               L ${d.target.x},${intermediateY} 
               L ${d.target.x},${targetTopY}`;
      })
      .attr("fill", "none")
      .attr("stroke", "#708090")
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
      .on("mouseover", function (event, d: any) {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("stroke-width", 4)
          .attr("stroke", d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333");
      })
      .on("mouseout", function (event, d: any) {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("stroke-width", 2)
          .attr("stroke", d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333");
      })
    // .on("click", (event, d: any) => {
    //   event.stopPropagation();
    //   setSelectedNode(d as any);

    //   const svgElement = svgRef.current;
    //   const svgRect = svgElement?.getBoundingClientRect();
    //   if (svgRect) {
    //     const x = event.clientX - svgRect.left;
    //     const y = event.clientY - svgRect.top;
    //     setContextMenu({ isVisible: true, x, y });
    //   }
    // });

    // Vẽ background cho node
    nodeGroup
      .append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .attr("rx", 12)
      .attr("ry", 12)
      .attr("fill", "#fff")
      .attr("stroke", (d: any) => d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333")
      .attr("stroke-width", 2)
      .attr("filter", "url(#shadow)");

    // Vẽ dấu cộng bo cong phía dưới card
    nodeGroup
      .append("path")
      .attr("d", `
M -40 0
Q -16 14 -10 16
Q 0 18 10 16
Q 16 14 40 0
Z


  `)
      .attr("transform", `translate(0, ${nodeHeight / 2 + 2})`)
      .attr("fill", "#fff")
      .attr("stroke-width", 2)
      .attr("filter", "url(#shadow)")
      .style("cursor", "pointer")
      .on("click", function (event, d: any) {
        event.stopPropagation();
        setSelectedNode(d as any);

        const svgElement = svgRef.current;
        const svgRect = svgElement?.getBoundingClientRect();
        if (svgRect) {
          const x = event.clientX - svgRect.left;
          const y = event.clientY - svgRect.top;
          setContextMenu({ isVisible: true, x, y });
        }
      })

      ;



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
      .style("pointer-events", "none")
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d as any);

        const svgElement = svgRef.current;
        const svgRect = svgElement?.getBoundingClientRect();
        if (svgRect) {
          const x = event.clientX - svgRect.left;
          const y = event.clientY - svgRect.top;
          setContextMenu({ isVisible: true, x, y });
        }
      });

    // Vẽ tên
    nodeGroup
      .append("text")
      .attr("dy", "-15")
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      .style("fill", "#222")
      .text((d: any) => d.name || "");

    // Vẽ giới tính
    nodeGroup
      .append("text")
      .attr("dy", "5")
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("fill", "#888")
      .text((d: any) => (d.gender === "M" ? "Nam" : d.gender === "F" ? "Nữ" : ""));

    // Vẽ thế hệ
    nodeGroup
      .append("text")
      .attr("dy", "25")
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("fill", "#888")
      .text((d: any) => `Đời ${d.generation}`);

  }, [treeData]);

  // Handle context menu actions
  const handleAddChild = () => {
    if (selectedNode) {
      setShowAddChildModal(true);
    }
  };

  const handleAddParent = () => {
    if (selectedNode) {
      setShowAddParentModal(true);
    }
  };

  const handleAddSpouse = () => {
    if (selectedNode) {
      setShowAddSpouseModal(true);
    }
  };

  const handleViewInfo = () => {
    if (selectedNode) {
      setShowPersonInfoModal(true);
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      setShowDeleteConfirmModal(true);
    }
  };

  // Handle form submissions with API calls
  const handleAddChildSubmit = async (data: any) => {
    try {
      function findPartnerId(root: any, spouseId: string | undefined | null): string | null {
        if (!root || !spouseId) return null;
        const spouses: any[] = root.spouses || [];
        const found = spouses.find((s: any) => s.id === spouseId);
        if (found) return root.id;
        const children: any[] = root.children || [];
        for (const child of children) {
          const partnerId = findPartnerId(child, spouseId);
          if (partnerId) return partnerId;
        }
        return null;
      }

      const selectedId = selectedNode?.id || null;
      const directSpouseId = selectedNode?.spouses?.[0]?.id || null;
      const partnerFromTree = findPartnerId(treeData, selectedId);

      const childrenType = data.childrenType;
      let parent1Id = selectedId;
      let parent2Id: string | null = directSpouseId || partnerFromTree || null;

      if (childrenType == 'SINGLE_PARENT') {
        parent2Id = null;
      } else if (childrenType == 'BIOLOGICAL') {
        if (!parent1Id || !parent2Id) {
          console.error('BIOLOGICAL requires both parents but one is missing.');
          return;
        }
      }

      const response = await familyService.addChildren(treeId, {
        parent1Id,
        parent2Id,
        child: {
          name: data.name,
          gender: data.gender,
          birthday: data.birthday,
          birthPlace: data.birthPlace,
        },
        childrenType,
        adoptionDate: data.adoptionDate,
        notes: data.notes,
      });

      if (response) {
        setShowAddChildModal(false);
        loadTreeData();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error adding child:', error);
    }
  };

  const handleAddParentSubmit = async (data: any) => {
    try {
      const response = await familyService.addParent(treeId, {
        childId: selectedNode?.id,
        newParent: {
          name: data.name,
          gender: data.gender,
          birthday: data.birthday,
          birthPlace: data.birthPlace,
        },
      });

      if (response) {
        setShowAddParentModal(false);
        loadTreeData();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error adding parent:', error);
    }
  };

  const handleAddSpouseSubmit = async (data: any) => {
    try {
      const response = await familyService.addSpouse(treeId, selectedNode?.id as string, {
        newSpouse: {
          name: data.name,
          gender: data.gender,
          birthday: data.birthday,
          birthPlace: data.birthPlace,
        },
        marriageDate: data.marriageDate,
        divorceDate: data.divorceDate,
      });

      if (response) {
        setShowAddSpouseModal(false);
        loadTreeData();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error adding spouse:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await familyService.deletePerson(selectedNode?.id as string);

      if (response.code == 200) {
        setShowDeleteConfirmModal(false);
        loadTreeData();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error deleting person:', error);
    }
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
      <div className="border border-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center" style={{ background: '#e5e7eb', minHeight: '700px' }}>
        <svg
          ref={svgRef}
          width="1800"
          height="800"
          className="family-tree-svg"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', background: '#e5e7eb', borderRadius: '0.75rem' }}
        />

        <ContextMenu
          isVisible={contextMenu.isVisible}
          x={contextMenu.x}
          y={contextMenu.y}
          onAddChild={handleAddChild}
          onAddParent={handleAddParent}
          onAddSpouse={handleAddSpouse}
          onViewInfo={handleViewInfo}
          onDelete={handleDelete}
          onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
        />
      </div>

      {/* Modals */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onSave={handleAddChildSubmit}
        parentName={selectedNode?.name}
      />

      <AddParentModal
        isOpen={showAddParentModal}
        onClose={() => setShowAddParentModal(false)}
        onSave={handleAddParentSubmit}
        childName={selectedNode?.name || ""}
      />

      <AddSpouseModal
        isOpen={showAddSpouseModal}
        onClose={() => setShowAddSpouseModal(false)}
        onSave={handleAddSpouseSubmit}
        personName={selectedNode?.name}
      />

      <PersonInfoModal
        isOpen={showPersonInfoModal}
        onClose={() => setShowPersonInfoModal(false)}
        person={selectedNode as any}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
        person={selectedNode as any}
      />
    </div>
  );
};

export default D3FamilyTreeView;