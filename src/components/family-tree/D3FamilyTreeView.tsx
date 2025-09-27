import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import familyService from '../../services/familyService';

interface D3FamilyTreeViewProps {
  treeId: string;
  personId?: string;
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
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Center tree function
  const centerTreeView = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = parseInt(svg.attr("width")) || 1400;
      const height = parseInt(svg.attr("height")) || 800;
      const centerX = width / 2;
      const centerY = height / 2;

      const svgGroup = svg.select("g");
      svgGroup.transition()
        .duration(750)
        .attr("transform", `translate(${centerX}, ${centerY}) scale(1)`);

      sessionStorage.removeItem('familyTreeTransform');
    }
  };

  // Expose center function
  useEffect(() => {
    if (svgRef.current) {
      (svgRef.current as any).centerTreeView = centerTreeView;
    }
  }, []);

  // Fetch family tree data
  useEffect(() => {
    const fetchData = async () => {
      if (!treeId || loading) return;

      setLoading(true);
      setError(null);
      setTreeData(null);

      try {
        let result;

        if (personId) {
          console.log(` Calling familyService.getPersonTreeRelations(${treeId}, ${personId})`);
          result = await familyService.getPersonTreeRelations(treeId, personId);
        } else {
          console.log(` Calling familyService.getTreeRelations(${treeId})`);
          result = await familyService.getTreeRelations(treeId);
        }

        console.log(' API Response:', result);

        if (result) {
          setTreeData(result);
          setError(null);
        } else {
          setError('No data returned from API');
        }

      } catch (err: any) {
        console.error(' API Error:', err);
        setError(err.message || 'API call failed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [treeId, personId]);

  // Render D3 Family Tree
  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    console.log(' Rendering D3 family tree...', treeData);

    const svg = d3.select(svgRef.current);
    const width = 1400;
    const height = 800;

    svg.attr("width", width)
      .attr("height", height)
      .style("background", "#f8fafc")
      .style("cursor", "grab");

    svg.selectAll("*").remove();

    // Add zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
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
      });

    const svgGroup = svg.call(zoom).append("g");

    const centerX = width / 2;
    const centerY = height / 2;

    // Check for saved transform
    let initialTransform = `translate(${centerX}, ${centerY}) scale(1)`;
    const saved = sessionStorage.getItem('familyTreeTransform');
    if (saved) {
      try {
        const { x, y, k } = JSON.parse(saved);
        initialTransform = `translate(${x || centerX}, ${y || centerY}) scale(${k || 1})`;
      } catch {
        initialTransform = `translate(${centerX}, ${centerY}) scale(1)`;
      }
    }

    const svgMain = svgGroup.append("g").attr("transform", initialTransform);

    // Render main person (center)
    const mainPersonGroup = svgMain.append("g")
      .attr("class", "main-person")
      .style("cursor", "pointer")
      .on("click", () => {
        console.log(' Main person clicked:', treeData);
        if (onNodeClick) onNodeClick(treeData);
      });

    // Main person rectangle
    mainPersonGroup.append("rect")
      .attr("x", -90)
      .attr("y", -50)
      .attr("width", 180)
      .attr("height", 100)
      .attr("fill", treeData.gender === 'M' ? "#3B82F6" : "#EC4899")
      .attr("stroke", "#FBBF24")
      .attr("stroke-width", 4)
      .attr("rx", 10)
      .style("filter", "drop-shadow(3px 3px 6px rgba(0,0,0,0.3))");

    // Main person name
    mainPersonGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -20)
      .attr("fill", "white")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(treeData.name || 'Unknown Person');

    // Main person birthday
    if (treeData.birthday) {
      mainPersonGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 0)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text(` ${treeData.birthday}`);
    }

    // Main person birth place
    if (treeData.birthPlace) {
      mainPersonGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("fill", "white")
        .attr("font-size", "11px")
        .text(` ${treeData.birthPlace}`);
    }

    // Generation badge
    mainPersonGroup.append("circle")
      .attr("cx", 75)
      .attr("cy", -40)
      .attr("r", 18)
      .attr("fill", "#10B981")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    mainPersonGroup.append("text")
      .attr("x", 75)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(treeData.generation || '1');

    // Render spouses (to the right)
    if (treeData.spouses && treeData.spouses.length > 0) {
      console.log(' Rendering spouses:', treeData.spouses);

      treeData.spouses.forEach((spouse: any, index: number) => {
        const spouseX = 280 + (index * 220);

        const spouseGroup = svgMain.append("g")
          .attr("transform", `translate(${spouseX}, 0)`)
          .style("cursor", "pointer")
          .on("click", () => {
            console.log(' Spouse clicked:', spouse);
            if (onNodeClick) onNodeClick(spouse);
          });

        // Spouse rectangle
        spouseGroup.append("rect")
          .attr("x", -80)
          .attr("y", -45)
          .attr("width", 160)
          .attr("height", 90)
          .attr("fill", spouse.gender === 'M' ? "#3B82F6" : "#EC4899")
          .attr("stroke", "#10B981")
          .attr("stroke-width", 3)
          .attr("rx", 8)
          .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))");

        // Spouse name
        spouseGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", -15)
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .text(spouse.name || 'Unknown Spouse');

        // Spouse birthday
        if (spouse.birthday) {
          spouseGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 5)
            .attr("fill", "white")
            .attr("font-size", "11px")
            .text(` ${spouse.birthday}`);
        }

        // Marriage date
        if (spouse.marriageDate) {
          spouseGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 25)
            .attr("fill", "white")
            .attr("font-size", "10px")
            .text(` ${spouse.marriageDate}`);
        }

        // Generation badge for spouse
        spouseGroup.append("circle")
          .attr("cx", 65)
          .attr("cy", -35)
          .attr("r", 15)
          .attr("fill", "#10B981")
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        spouseGroup.append("text")
          .attr("x", 65)
          .attr("y", -30)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .text(spouse.generation || treeData.generation || '1');

        // Marriage connection line (curved)
        const marriagePath = d3.path();
        marriagePath.moveTo(90, 0);
        marriagePath.quadraticCurveTo((90 + spouseX - 80) / 2, -40, spouseX - 80, 0);

        svgMain.append("path")
          .attr("d", marriagePath.toString())
          .attr("stroke", "#10B981")
          .attr("stroke-width", 4)
          .attr("fill", "none")
          .attr("stroke-dasharray", "8,4")
          .style("filter", "drop-shadow(1px 1px 2px rgba(0,0,0,0.1))");

        // Heart symbol on marriage line
        svgMain.append("text")
          .attr("x", (90 + spouseX - 80) / 2)
          .attr("y", -30)
          .attr("text-anchor", "middle")
          .attr("font-size", "20px")
          .text("");
      });
    }

    // Render children (below main person)
    if (treeData.children && treeData.children.length > 0) {
      console.log('👶 Rendering children:', treeData.children);

      const childrenY = 180;
      const childSpacing = 180;
      const startX = -(treeData.children.length - 1) * childSpacing / 2;

      // Children header
      svgMain.append("text")
        .attr("x", 0)
        .attr("y", 120)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#4B5563")
        .text(` ${treeData.children.length} ${treeData.children.length === 1 ? 'Child' : 'Children'}`);

      treeData.children.forEach((childId: string, index: number) => {
        const childX = startX + (index * childSpacing);

        const childGroup = svgMain.append("g")
          .attr("transform", `translate(${childX}, ${childrenY})`)
          .style("cursor", "pointer")
          .on("click", () => {
            console.log(' Child clicked:', childId);
            if (onNodeClick) onNodeClick({ id: childId, name: `Child ${index + 1}` });
          });

        // Child placeholder rectangle (dashed since we only have ID)
        childGroup.append("rect")
          .attr("x", -75)
          .attr("y", -40)
          .attr("width", 150)
          .attr("height", 80)
          .attr("fill", "#9CA3AF")
          .attr("stroke", "#6B7280")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "6,4")
          .attr("rx", 8)
          .attr("opacity", 0.9)
          .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))");

        // Child placeholder text
        childGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", -15)
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .text(`Child ${index + 1}`);

        // Child ID (shortened)
        childGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", 5)
          .attr("fill", "white")
          .attr("font-size", "9px")
          .text(`ID: ${childId.substring(0, 12)}...`);

        // Generation info for child
        childGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", 20)
          .attr("fill", "white")
          .attr("font-size", "8px")
          .text(`Gen: ${(treeData.generation || 1) + 1}`);

        // Parent-child connection line
        svgMain.append("line")
          .attr("x1", 0)
          .attr("y1", 50)
          .attr("x2", childX)
          .attr("y2", childrenY - 40)
          .attr("stroke", "#6B7280")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "4,2");

        // Child number badge
        childGroup.append("circle")
          .attr("cx", 60)
          .attr("cy", -30)
          .attr("r", 12)
          .attr("fill", "#F59E0B")
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        childGroup.append("text")
          .attr("x", 60)
          .attr("y", -25)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .text(index + 1);
      });
    }

    // Tree title
    svgMain.append("text")
      .attr("x", 0)
      .attr("y", -height / 2 + 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", "#1F2937")
      .text(`🌳 ${treeData.name}'s Family Tree`);

    // API success indicator
    svgMain.append("rect")
      .attr("x", -width / 2 + 20)
      .attr("y", -height / 2 + 70)
      .attr("width", 250)
      .attr("height", 30)
      .attr("fill", "#10B981")
      .attr("rx", 15)
      .attr("opacity", 0.1);

    svgMain.append("text")
      .attr("x", -width / 2 + 30)
      .attr("y", -height / 2 + 90)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#10B981")
      .text(`✅ API Success - TreeID: ${treeId.substring(0, 8)}...`);

    console.log('✅ D3 family tree rendered successfully!');

  }, [treeData, onNodeClick, treeId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-blue-800 mb-3">🔄 Loading Family Tree</h3>
          <p className="text-blue-600 mb-2">
            {personId ? 'Getting person relations...' : 'Getting tree relations...'}
          </p>
          <div className="bg-blue-100 rounded-lg p-4 text-sm text-blue-700">
            <p><strong>TreeID:</strong> {treeId}</p>
            {personId && <p><strong>PersonID:</strong> {personId}</p>}
            <p><strong>API:</strong> familyService.{personId ? 'getPersonTreeRelations' : 'getTreeRelations'}</p>
            <p><strong>Endpoint:</strong> /relations/trees/{treeId}{personId ? `/persons/${personId}` : ''}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center max-w-lg">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-red-800 mb-4">API Error</h3>

          <div className="bg-red-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-800 font-bold mb-3">Error Details:</p>
            <p className="text-red-700 text-sm mb-4 bg-white p-3 rounded border">{error}</p>

            <div className="text-xs text-red-600 space-y-1 border-t border-red-200 pt-3">
              <p><strong>TreeID:</strong> {treeId}</p>
              {personId && <p><strong>PersonID:</strong> {personId}</p>}
              <p><strong>API Method:</strong> familyService.{personId ? 'getPersonTreeRelations' : 'getTreeRelations'}</p>
              <p><strong>Endpoint:</strong> /relations/trees/{treeId}{personId ? `/persons/${personId}` : ''}</p>
              <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://geneology-web-be.onrender.com/api'}</p>
            </div>
          </div>

          <div className="space-x-4">
            <button
              onClick={() => {
                setError(null);
                setTreeData(null);
                if (onRefresh) onRefresh();
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
            >
              🔄 Try Again
            </button>

            <button
              onClick={() => {
                console.log('🐛 Full Debug Info:', {
                  treeId,
                  personId,
                  error,
                  baseURL: import.meta.env.VITE_API_BASE_URL,
                  treeData
                });
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors"
            >
              🐛 Debug Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state with family tree
  if (treeData) {
    return (
      <div className="w-full">
        {/* Tree Info Header */}
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                🌳 {treeData.name} - Generation {treeData.generation}
              </h3>
              <div className="flex space-x-6 text-sm text-green-600">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Main Person
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  {treeData.spouses?.length || 0} Spouse(s)
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                  {treeData.children?.length || 0} Children
                </span>
              </div>
              <p className="text-xs text-green-500 mt-2">
                ✅ Loaded via familyService.{personId ? 'getPersonTreeRelations' : 'getTreeRelations'}
              </p>
            </div>
            <div className="text-right text-xs text-green-600">
              <p>TreeID: {treeId.substring(0, 12)}...</p>
              {personId && <p>PersonID: {personId.substring(0, 12)}...</p>}
              {treeData.birthday && <p>Born: {treeData.birthday}</p>}
              {treeData.birthPlace && <p>Place: {treeData.birthPlace}</p>}
            </div>
          </div>
        </div>

        {/* D3 Family Tree SVG */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full family-tree-svg"
            style={{
              minHeight: '700px',
              cursor: 'grab'
            }}
          />
        </div>

        {/* Control Panel */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                console.log('🔍 Tree Data:', treeData);
                alert(`Family Tree Data:\n\nName: ${treeData.name}\nGeneration: ${treeData.generation}\nBirthday: ${treeData.birthday || 'N/A'}\nBirth Place: ${treeData.birthPlace || 'N/A'}\nSpouses: ${treeData.spouses?.length || 0}\nChildren: ${treeData.children?.length || 0}`);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition-colors"
            >
              🔍 View Details
            </button>

            <button
              onClick={centerTreeView}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-semibold transition-colors"
            >
              🎯 Center Tree
            </button>

            <button
              onClick={() => {
                setTreeData(null);
                setError(null);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition-colors"
            >
              🔄 Refresh Tree
            </button>

            <button
              onClick={() => {
                console.log('🌳 Family Tree Component State:', {
                  treeId,
                  personId,
                  hasData: !!treeData,
                  dataKeys: treeData ? Object.keys(treeData) : [],
                  spousesCount: treeData?.spouses?.length || 0,
                  childrenCount: treeData?.children?.length || 0
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold transition-colors"
            >
              🐛 Debug
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback state
  return (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border-2 border-gray-300">
      <div className="text-center">
        <div className="text-gray-400 text-5xl mb-4">🌳</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-3">Family Tree Ready</h3>
        <p className="text-gray-500 text-sm mb-2">TreeID: {treeId}</p>
        {personId && <p className="text-gray-500 text-sm mb-2">PersonID: {personId}</p>}
        <p className="text-gray-400 text-xs">Waiting for data...</p>
      </div>
    </div>
  );
};

export default D3FamilyTreeView;