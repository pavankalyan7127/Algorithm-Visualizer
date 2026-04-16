import React, { useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";

const BAR_WIDTH = 60;
const HEIGHT = 300;

const getNodePositions = (nodes, width, height) => {
  const radius = 180;
  const centerX = width / 2;
  const centerY = height / 2;

  const pos = {};

  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;

    pos[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return pos;
};

const getTreePosition = (index, width) => {
  const level = Math.floor(Math.log2(index + 1));
  const posInLevel = index - (2 ** level - 1);

  const nodesInLevel = 2 ** level;
  const spacing = width / (nodesInLevel + 1);

  return {
    x: spacing * (posInLevel + 1),
    y: 80 + level * 80
  };
};

export function VisualizationCanvas({ data, stepIndex, currentArray, activeIndices, isCompareMode }) {
  const [stageScale, setStageScale] = useState(1);

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const newScale =
      e.evt.deltaY > 0 ? stageScale / scaleBy : stageScale * scaleBy;

    setStageScale(newScale);
  };

  if (!data) return null;

  const scale = isCompareMode ? 0.7 : 1.2;
  const stageDimensions = {
    linear: { width: 400, height: 400 },
    tree: { width: 900, height: 450 },
    graph: { width: 900, height: 550 },
    grid: { width: 600, height: 600 },
    state: { width: 800, height: 400 },
  };
  const { width: stageWidth, height: stageHeight } =
    stageDimensions[data.visualizationType] || { width: 800, height: 400 };

  let stage = null;

  if (data.visualizationType === "linear") {
    stage = (
      <Stage width={800} height={HEIGHT}>
        <Layer>
          {currentArray.map((value, i) => {
            const h = value * 20;
            const active = activeIndices.includes(i);

            return (
              <React.Fragment key={i}>
                <Rect
                  x={i * BAR_WIDTH}
                  y={HEIGHT - h}
                  width={BAR_WIDTH - 5}
                  height={h}
                  fill={active ? "#FFDBFD" : "#8494FF"}
                  cornerRadius={4}
                />

                <Text
                  text={value.toString()}
                  x={i * BAR_WIDTH + 18}
                  y={HEIGHT - h - 24}
                  fill="#ffffff"
                />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
    );
  }

  if (data.visualizationType === "tree") {
    stage = (
      <Stage width={900} height={450}>
        <Layer>
          {(() => {
            const heap = data.structure.heapArray;
            const step = data.steps[stepIndex] || {};
            const arr = step.heapArray || heap;

            return arr.map((val, i) => {
              const pos = getTreePosition(i, 900);
              const parentIndex = Math.floor((i - 1) / 2);
              const parentPos =
                i > 0 ? getTreePosition(parentIndex, 900) : null;

              return (
                <React.Fragment key={i}>
                  {parentPos && (
                    <Line
                      points={[parentPos.x, parentPos.y, pos.x, pos.y]}
                      stroke="#C9BEFF"
                      strokeWidth={3}
                    />
                  )}

                  <Circle x={pos.x} y={pos.y} radius={25} fill="#8494FF" />

                  <Text
                    text={val.toString()}
                    x={pos.x - 6}
                    y={pos.y - 8}
                    fill="#000000"
                  />
                </React.Fragment>
              );
            });
          })()}
        </Layer>
      </Stage>
    );
  }

  if (data.visualizationType === "graph") {
    stage = (
      <Stage
        width={900}
        height={550}
        scaleX={stageScale}
        scaleY={stageScale}
        draggable
        onWheel={handleWheel}
      >
        <Layer>
          {(() => {
            const nodes = data.structure.nodes;
            const edges = data.structure.edges;

            const pos = getNodePositions(nodes, 900, 550);

            const step = data.steps[stepIndex] || {};

            const activeNodes = step.activeNodes || [];
            const visitedNodes = step.visitedNodes || [];
            const activeEdges = step.activeEdges || [];

            return (
              <>
                {edges.map((e, i) => {
                  const from = pos[e.from];
                  const to = pos[e.to];

                  const active = activeEdges.some(
                    (a) => a.from === e.from && a.to === e.to
                  );

                  return (
                    <Line
                      key={i}
                      points={[from.x, from.y, to.x, to.y]}
                      stroke={active ? "#FFDBFD" : "#C9BEFF"}
                      strokeWidth={4}
                    />
                  );
                })}

                {nodes.map((n, i) => {
                  const p = pos[n.id];

                  const active = activeNodes.includes(n.id);
                  const visited = visitedNodes.includes(n.id);

                  let color = "#8494FF";
                  let scale = 1;

                  if (visited) color = "#6BCB77";
                  if (active) {
                    color = "#FFDBFD";
                    scale = 1.3;
                  }

                  return (
                    <React.Fragment key={i}>
                      <Circle
                        x={p.x}
                        y={p.y}
                        radius={25}
                        fill={color}
                        scaleX={scale}
                        scaleY={scale}
                        draggable
                      />

                      <Text
                        text={n.id}
                        x={p.x - 6}
                        y={p.y - 8}
                        fill="#000000"
                      />
                    </React.Fragment>
                  );
                })}
              </>
            );
          })()}
        </Layer>
      </Stage>
    );
  }

  if (data.visualizationType === "grid") {
    stage = (
      <Stage width={600} height={600}>
        <Layer>
          {(() => {
            const cell = 60;
            const step = data.steps[stepIndex] || {};

            const grid = step.grid || data.structure.initialGrid;

            const activeCells = step.activeCells || [];

            return grid.map((row, r) =>
              row.map((val, c) => {
                const active = activeCells.some(
                  ([ar, ac]) => ar === r && ac === c
                );

                return (
                  <React.Fragment key={`${r}-${c}`}>
                    <Rect
                      x={c * cell}
                      y={r * cell}
                      width={cell}
                      height={cell}
                      fill={active ? "#FFDBFD" : "#F5F5FF"}
                      stroke="#C9BEFF"
                    />

                    <Text
                      text={val === 0 ? "" : val.toString()}
                      x={c * cell + 22}
                      y={r * cell + 18}
                      fill="#000000"
                    />
                  </React.Fragment>
                );
              })
            );
          })()}
        </Layer>
      </Stage>
    );
  }

  if (data.visualizationType === "state") {
    stage = (
      <Stage width={800} height={400}>
        <Layer>
          {(() => {
            const states = data.structure.states;
            const transitions = data.structure.transitions;

            const spacing = 180;

            const step = data.steps[stepIndex] || {};

            const activeState = step.activeState;
            const activeTransition = step.activeTransition;

            return (
              <>
                {transitions.map((t, i) => {
                  const fromI = states.findIndex((s) => s.id === t.from);

                  const toI = states.findIndex((s) => s.id === t.to);

                  const x1 = 100 + fromI * spacing;
                  const x2 = 100 + toI * spacing;

                  const active = `${t.from}-${t.to}` === activeTransition;

                  return (
                    <React.Fragment key={i}>
                      <Line
                        points={[x1, 200, x2, 200]}
                        stroke={active ? "#FFDBFD" : "#C9BEFF"}
                        strokeWidth={3}
                      />

                      <Text
                        text={t.label}
                        x={(x1 + x2) / 2}
                        y={180}
                        fill="#ffffff"
                      />
                    </React.Fragment>
                  );
                })}

                {states.map((s, i) => {
                  const x = 100 + i * spacing;

                  const active = s.id === activeState;

                  return (
                    <React.Fragment key={i}>
                      <Circle
                        x={x}
                        y={200}
                        radius={30}
                        fill={active ? "#FFDBFD" : "#ddd"}
                        stroke="#8494FF"
                      />

                      <Text
                        text={s.id}
                        x={x - 10}
                        y={192}
                        fill="#ffffff"
                      />
                    </React.Fragment>
                  );
                })}
              </>
            );
          })()}
        </Layer>
      </Stage>
    );
  }

  if (data.visualizationType === "stack") {
  stage = (
    <Stage width={900} height={500}>
      <Layer>
        {(() => {
          const step = data.steps[stepIndex] || {};
          const rods = step.rods || data.structure.rods;

          const rodWidth = 120;
          const spacing = 250;

          return rods.map((rod, rIndex) => {
            const xBase = 150 + rIndex * spacing;

            return (
              <React.Fragment key={rIndex}>
                {/* Rod Base */}
                <Rect
                  x={xBase - 10}
                  y={100}
                  width={20}
                  height={300}
                  fill="#C9BEFF"
                />

                {/* Disks */}
                {rod.map((disk, i) => {
                  const width = 40 + disk * 20;

                  return (
                    <Rect
                      key={i}
                      x={xBase - width / 2}
                      y={380 - i * 25}
                      width={width}
                      height={20}
                      fill="#8494FF"
                      cornerRadius={4}
                    />
                  );
                })}

                {/* Label */}
                <Text
                  text={`Rod ${String.fromCharCode(65 + rIndex)}`}
                  x={xBase - 30}
                  y={420}
                  fill="#ffffff"
                />
              </React.Fragment>
            );
          });
        })()}
      </Layer>
    </Stage>
  );
}

  
  if (data.visualizationType === "custom") {
  stage = (
    <Stage width={900} height={500}>
      <Layer>
        {(() => {
          const step = data.steps[stepIndex] || {};
          const structure = step.structure || data.structure;

          const type = structure.type;

          /* ---------- MULTI STACK (like Hanoi fallback) ---------- */
          if (type === "multi-stack") {
            const containers = structure.containers;

            const spacing = 250;

            return containers.map((c, idx) => {
              const xBase = 150 + idx * spacing;

              return (
                <React.Fragment key={idx}>
                  <Rect
                    x={xBase - 10}
                    y={100}
                    width={20}
                    height={300}
                    fill="#C9BEFF"
                  />

                  {c.values.map((val, i) => {
                    const width = 40 + val * 20;

                    return (
                      <Rect
                        key={i}
                        x={xBase - width / 2}
                        y={380 - i * 25}
                        width={width}
                        height={20}
                        fill="#8494FF"
                        cornerRadius={4}
                      />
                    );
                  })}

                  <Text
                    text={c.id}
                    x={xBase - 20}
                    y={420}
                    fill="#ffffff"
                  />
                </React.Fragment>
              );
            });
          }

          /* ---------- MULTI ARRAY ---------- */
          if (type === "multi-array") {
            const arrays = structure.arrays;

            return arrays.map((arr, row) =>
              arr.map((val, col) => (
                <React.Fragment key={`${row}-${col}`}>
                  <Rect
                    x={col * 70 + 50}
                    y={row * 80 + 50}
                    width={60}
                    height={60}
                    fill="#8494FF"
                    cornerRadius={6}
                  />
                  <Text
                    text={val.toString()}
                    x={col * 70 + 70}
                    y={row * 80 + 70}
                    fill="#ffffff"
                  />
                </React.Fragment>
              ))
            );
          }

          /* ---------- FALLBACK ---------- */
          return (
            <Text
              text="Custom visualization not supported yet"
              x={200}
              y={200}
              fill="#ffffff"
            />
          );
        })()}
      </Layer>
    </Stage>
  );
}

  if (!stage) return null;

  const scaledWidth = stageWidth * scale;
  const scaledHeight = stageHeight * scale;

  return (
    <div className="visualization-canvas-root">
      {!isCompareMode && <h2 className="visualization-heading">{data.title || "Visualization"}</h2>}
      <div className="visualization-stage-center">
        <div
          className="visualization-scaled-wrapper"
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
              width: stageWidth,
              height: stageHeight,
            }}
          >
            {stage}
          </div>
        </div>
      </div>
    </div>
  );
}

