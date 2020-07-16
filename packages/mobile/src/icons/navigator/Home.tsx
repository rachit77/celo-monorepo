import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export function Home() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M13.486 13.12v-.001c.445-2.135 1.407-4.045 2.618-5.503 1.21-1.459 2.647-2.358 3.94-2.583l.035-.006.035-.009a.254.254 0 01.049-.008c.028-.002.061-.002.148-.002h.028l.028-.002a3.495 3.495 0 012.828 1.141c1.086 1.21 1.587 3.199 1.148 5.599h0v.006c-.369 2.085-1.29 4.001-2.504 5.449-1.22 1.454-2.682 2.374-4.111 2.604-1.263.192-2.352-.161-3.136-1h0l-.007-.008c-1.133-1.19-1.614-3.226-1.099-5.676z"
        stroke="#B4B9BD"
        strokeWidth={2}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.185 20.467l-.001.004c-.472 2.247.012 3.906.844 4.78l.007.007.007.008c.533.57 1.278.842 2.25.695 1.128-.182 2.389-.934 3.5-2.259 1.1-1.312 1.947-3.066 2.284-4.98l.003-.012c.4-2.186-.085-3.826-.903-4.744a2.495 2.495 0 00-2.033-.817l-.056.003h-.095l-.057.01c-.995.173-2.236.903-3.342 2.236-1.108 1.335-1.998 3.095-2.408 5.069zm9.468-7.85c1.353 1.504 1.87 3.84 1.393 6.453-.796 4.512-3.981 8.313-7.445 8.867-1.552.238-2.986-.198-4.02-1.306-1.434-1.505-1.912-3.92-1.354-6.572.477-2.296 1.513-4.354 2.826-5.938 1.314-1.583 2.946-2.652 4.539-2.93.16-.039.279-.039.438-.039 1.393-.08 2.667.436 3.623 1.465z"
        fill="#B4B9BD"
      />
    </Svg>
  )
}

export default React.memo(Home)
