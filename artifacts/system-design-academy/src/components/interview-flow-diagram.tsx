type InterviewFlowDiagramProps = {
  questionId: string;
  steps: string[];
};

const nodeWidth = 180;
const nodeHeight = 54;
const columnGap = 30;
const rowGap = 34;
const diagramWidth = 640;

function wrapLabel(label: string, maxLength = 22) {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    if (word.length > maxLength) {
      if (line) lines.push(line);
      line = '';
      for (let offset = 0; offset < word.length; offset += maxLength) {
        const part = word.slice(offset, offset + maxLength);
        if (offset + maxLength < word.length) lines.push(part);
        else line = part;
      }
      continue;
    }

    if (line && `${line} ${word}`.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function KafkaArchitectureDiagram() {
  const paths = [
    'M100 95 L220 57 L420 57 L540 95',
    'M100 95 L220 97 L420 97 L540 95',
    'M100 95 L220 137 L420 137 L540 95',
  ];

  return <svg className="guide-diagram guide-diagram-custom" viewBox="0 0 640 190" role="img" aria-labelledby="kafka-architecture-title">
    <title id="kafka-architecture-title">Kafka producer sends records through broker topic partitions to a consumer</title>
    {paths.map((path) => <path className="guide-diagram-path" d={path} key={path} />)}
    <rect className="guide-diagram-node" x="10" y="70" width="90" height="50" rx="5" />
    <text className="guide-diagram-label" x="55" y="95">Producer</text>
    <rect className="guide-diagram-node" x="200" y="12" width="240" height="166" rx="5" />
    <text className="guide-diagram-label" x="320" y="30">Broker · topic: orders</text>
    {[0, 1, 2].map((partition) => <g key={partition}>
      <rect className="guide-diagram-node" x="220" y={42 + partition * 40} width="200" height="30" rx="4" />
      <text className="guide-diagram-label" x="320" y={57 + partition * 40}>Partition {partition}</text>
    </g>)}
    <rect className="guide-diagram-node" x="540" y="70" width="90" height="50" rx="5" />
    <text className="guide-diagram-label" x="585" y="95">Consumer</text>
    {paths.map((path, index) => <circle className="guide-diagram-packet" key={path} r="6"><animateMotion dur="3s" begin={`${index}s`} repeatCount="indefinite" path={path} /></circle>)}
  </svg>;
}

function KafkaPartitionDiagram() {
  const paths = [
    'M90 100 L150 40 L330 40 L480 40',
    'M90 100 L150 90 L330 90 L480 90',
    'M90 100 L150 140 L330 140 L480 140',
  ];

  return <svg className="guide-diagram guide-diagram-custom" viewBox="0 0 640 210" role="img" aria-labelledby="kafka-partitions-title">
    <title id="kafka-partitions-title">Three Kafka partitions are assigned to three workers, leaving a fourth worker idle</title>
    {paths.map((path) => <path className="guide-diagram-path" d={path} key={path} />)}
    <text className="guide-diagram-label" x="240" y="14">Topic · 3 partitions</text>
    <rect className="guide-diagram-node" x="10" y="80" width="80" height="40" rx="5" />
    <text className="guide-diagram-label" x="50" y="100">Producer</text>
    {[0, 1, 2].map((partition) => <g key={partition}>
      <rect className="guide-diagram-node" x="150" y={25 + partition * 50} width="180" height="30" rx="4" />
      <text className="guide-diagram-label" x="240" y={40 + partition * 50}>Partition {partition}</text>
      <rect className="guide-diagram-node" x="480" y={25 + partition * 50} width="100" height="30" rx="4" />
      <text className="guide-diagram-label" x="530" y={40 + partition * 50}>Worker {partition + 1}</text>
      <circle className="guide-diagram-packet" r="6"><animateMotion dur="3s" begin={`${partition}s`} repeatCount="indefinite" path={paths[partition]} /></circle>
    </g>)}
    <rect className="guide-diagram-node guide-diagram-idle" x="480" y="172" width="100" height="30" rx="4" />
    <text className="guide-diagram-label guide-diagram-idle-label" x="530" y="187">Worker 4 · idle</text>
  </svg>;
}

export default function InterviewFlowDiagram({ questionId, steps }: InterviewFlowDiagramProps) {
  if (questionId === 'K01') return <KafkaArchitectureDiagram />;
  if (questionId === 'K02') return <KafkaPartitionDiagram />;

  const rows = Math.ceil(steps.length / 3);
  const height = rows * (nodeHeight + rowGap) + 10;
  const nodes = steps.map((label, index) => {
    const row = Math.floor(index / 3);
    const positionInRow = index % 3;
    const column = row % 2 === 0 ? positionInRow : 2 - positionInRow;
    const x = 10 + column * (nodeWidth + columnGap);
    const y = 10 + row * (nodeHeight + rowGap);
    return { label, index, x, y, lines: wrapLabel(label) };
  });
  const path = `M${nodes.map(({ x, y }) => `${x + nodeWidth / 2} ${y + nodeHeight / 2}`).join(' L')}`;
  const duration = `${Math.max(5, steps.length * 1.3)}s`;

  return <svg className="guide-diagram" viewBox={`0 0 ${diagramWidth} ${height}`} role="img" aria-labelledby={`flow-title-${questionId}`}>
    <title id={`flow-title-${questionId}`}>{`${questionId} flow: ${steps.join(' then ')}`}</title>
    <path className="guide-diagram-path" d={path} />
    {nodes.map(({ label, index, x, y, lines }) => <g key={`${questionId}-${index}`}>
      <rect className="guide-diagram-node" x={x} y={y} width={nodeWidth} height={nodeHeight} rx="5" />
      <text className="guide-diagram-label" x={x + nodeWidth / 2} y={y + nodeHeight / 2}>
        <tspan className="guide-diagram-index" x={x + 14} dy={`${-((lines.length - 1) * 0.55)}em`}>{String(index + 1).padStart(2, '0')}</tspan>
        {lines.map((line, lineIndex) => <tspan key={`${index}-${lineIndex}`} x={x + nodeWidth / 2 + 5} dy={lineIndex === 0 ? 0 : '1.1em'}>{line}</tspan>)}
      </text>
    </g>)}
    <circle className="guide-diagram-packet" r="7"><animateMotion dur={duration} repeatCount="indefinite" path={path} /></circle>
  </svg>;
}