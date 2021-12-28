// @ts-nocheck
import { forwardRef } from "react";

// Overlay.propTypes = {
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   children: PropTypes.node.isRequired
// };


/**
 * Use Overlay as a wrapper for components that need mouse events to be handled.
 * For example: Tooltip, AxisX.
 */
const Overlay = forwardRef(({ width, height, children }, ref) => (
  <g>
    {children}
    <rect ref={ref} width={width} height={height} opacity={0} />
  </g>
));



export default Overlay;
