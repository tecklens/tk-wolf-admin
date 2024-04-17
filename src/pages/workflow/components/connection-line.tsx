export default function ConnectionLine({ fromX, fromY, toX, toY }: {
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
}) {

  return (
    <g>
      <path
        fill="none"
        stroke={'rgb(249 115 22)'}
        strokeWidth={2}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="red"
        r={3}
        stroke={'rgb(249 115 22)'}
        strokeWidth={2}
      />
    </g>
  )
}
