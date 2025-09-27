import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3FamilyTreeViewProps {
  treeId: string;
  personId: string;
  zoomLevel?: number;
  onRefresh?: () => void;
  onNodeClick?: (person: any) => void;
}

const D3FamilyTreeView: React.FC<D3FamilyTreeViewProps> = ({
  treeId,
  personId,
  zoomLevel = 1,
  onRefresh,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm căn giữa cây gia phả
  const centerTreeView = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = parseInt(svg.attr("width")) || 2000;
      const height = parseInt(svg.attr("height")) || 1200;
      const centerX = width / 2;
      const centerY = height / 2;

      const svgGroup = svg.select("g");
      svgGroup.transition()
        .duration(750)
        .attr("transform", `translate(${centerX}, ${centerY}) scale(1)`);

      // Xóa transform đã lưu
      sessionStorage.removeItem('familyTreeTransform');
    }
  };

  // Cung cấp hàm center cho component cha
  useEffect(() => {
    if (svgRef.current) {
      (svgRef.current as any).centerTreeView = centerTreeView;
    }
  }, []);

  // Thiết lập D3 cơ bản vì chưa có API chi tiết cây gia phả
  useEffect(() => {
    if (!svgRef.current) return;

    let width = 2000;
    let height = 1200;
    const sessionWidth = sessionStorage.getItem('familyTreeSvgWidth');
    const sessionHeight = sessionStorage.getItem('familyTreeSvgHeight');
    if (sessionWidth && sessionHeight) {
      width = parseInt(sessionWidth, 10);
      height = parseInt(sessionHeight, 10);
    }

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "grab");

    svg.selectAll("*").remove();

    // Thêm chức năng zoom/pan
    const svgGroup = svg
      .call(
        d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.2, 3])
          .on("start", function () {
            d3.select(this).style("cursor", "grabbing");
          })
          .on("zoom", (event) => {
            svgMain.attr("transform", event.transform);
            sessionStorage.setItem('familyTreeTransform', JSON.stringify({
              x: event.transform.x,
              y: event.transform.y,
              k: event.transform.k
            }));
          })
          .on("end", function () {
            d3.select(this).style("cursor", "grab");
          })
      )
      .append("g");

    const centerX = width / 2;
    const centerY = height / 2;

    let initialTransform = `translate(${centerX}, ${centerY}) scale(1)`;
    const saved = sessionStorage.getItem('familyTreeTransform');
    const isFirstLoad = !sessionStorage.getItem('familyTreeInitialized');

    if (saved && !isFirstLoad) {
      try {
        const { x, y, k } = JSON.parse(saved);
        initialTransform = `translate(${x || centerX},${y || centerY}) scale(${k || 1})`;
      } catch {
        initialTransform = `translate(${centerX}, ${centerY}) scale(1)`;
      }
    } else {
      sessionStorage.setItem('familyTreeInitialized', 'true');
    }

    const svgMain = svgGroup.append("g").attr("transform", initialTransform);

    // Hiển thị thông báo placeholder vì chưa có API chi tiết cây gia phả
    svgMain
      .append("text")
      .attr("x", 0)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", "#666")
      .text("Xem Cây Gia Phả");

    svgMain
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "#999")
      .text(`ID Cây: ${treeId} | ID Người: ${personId}`);

    svgMain
      .append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#999")
      .text("API chi tiết cây gia phả chưa được triển khai");

    svgMain
      .append("text")
      .attr("x", 0)
      .attr("y", 100)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#ccc")
      .text("Hiện tại chỉ có API: createTree, getUserTrees, updateTree, deleteTree");

  }, [treeId, personId, zoomLevel]);

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
            onClick={() => setError(null)}
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
      <div
        className="border border-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center cursor-grab hover:cursor-grab active:cursor-grabbing"
        style={{ background: '#e5e7eb', minHeight: '700px' }}
      >
        <svg
          ref={svgRef}
          width="1800"
          height="1200"
          className="family-tree-svg"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            background: '#e5e7eb',
            borderRadius: '0.75rem'
          }}
        />
      </div>
    </div>
  );
};

export default D3FamilyTreeView;