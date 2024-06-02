import { Able, MoveableManagerInterface } from 'react-moveable'

export interface DimensionViewableProps {
  dimensionViewable?: boolean;
}
export const DimensionViewable: Able<DimensionViewableProps, any> = {
  name: "dimensionViewable",
  props: ['dimensionViewable'],
  events: [],
  render(moveable: MoveableManagerInterface) {
    const { left, top } = moveable.state;

    const rect = moveable.getRect();

    return <div key={"dimension-viewer"} className={"moveable-dimension"} style={{
      left: `${rect.left + rect.width / 2 - left}px`,
      top: `${rect.top + rect.height + 20 - top}px`,
    }}>
      {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
    </div>
  }
}