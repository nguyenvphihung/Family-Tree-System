import React, { Children, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../../types/family';
import familyService from '../../services/familyService';
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

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await familyService.getTreeRelations(treeId);
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

    // Thu thập node/link theo thuật toán trong file HTML
    const allNodes: Array<TreeNode & { x: number; y: number; generation: number }> = [];
    const spouseLinks: Array<{ source: { x: number; y: number }; target: { x: number; y: number } }> = [];
    const parentChildLinks: Array<{ source: { x: number; y: number }; target: { x: number; y: number } }> = [];

    const nodeWidth = 200;
    const nodeHeight = 90;
    const spouseSpacing = 240;
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

    function calculatePositions(person: TreeNode, x = 0, y = 0, generation = 0) {
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

          // Tạo liên kết từ dưới card cha mẹ xuống con
          parentChildLinks.push({
            source: { x: parentCenterX, y: y + nodeHeight / 50 },
            target: { x: childCenterX, y: childY - nodeHeight / 10 }
          });

          calculatePositions(child as TreeNode, childCenterX, childY, generation + 1);
          startX += childWidths[idx];
        });
      }
    }

    // Bắt đầu tính toán từ vị trí (0, 0) để cây được căn giữa tự nhiên
    calculatePositions(treeData as TreeNode, 0, 0);

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
          .attr("stroke", d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333")
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
      .attr("stroke", (d: any) => d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#333")
      .attr("stroke-width", 2)
      .attr("filter", "url(#shadow)");

    // Avatar circle - bên trái
    nodeGroup
      .append("circle")
      .attr("cx", -nodeWidth / 2 + 35)
      .attr("cy", 0)
      .attr("r", 28)
      .attr("fill", "#f3f4f6")
      .attr("stroke", (d: any) => d.gender === "M" ? "#5BD1D7" : d.gender === "F" ? "#F59794" : "#e5e7eb")
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
    if (selectedNode && onViewInfo) {
      onViewInfo(selectedNode);
    }
  };

  const handleDelete = () => {
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
          onAddChild={handleAddChild}
          onAddParent={handleAddParent}
          onAddSpouse={handleAddSpouse}
          onViewInfo={handleViewInfo}
          onDelete={handleDelete}
          onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
        />
      </div>
    </div>
  );
};

export default D3FamilyTreeView;