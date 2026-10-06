// Story 用的占位图，全部是代码画的几何图形，不是官方素材。
// 人形剪影沿用 docs/assets/imagery.svg 里自绘的那条路径；场景是低饱和的色块加几何体。
// 放在 .storybook/ 下，只有 Storybook 会用到，不进组件库产物。

const toDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

const FIGURE =
  'M50 8C66 8 76 22 74 40c-1 10-6 16-10 20 20 10 32 50 34 140H2C4 110 16 70 36 60c-4-4-9-10-10-20C24 22 34 8 50 8Z'

/**
 * 人形剪影，透明底，1:2。身上压几块几何色块，这样裁切、去色、重影之后还看得出是同一张图。
 *
 * @param body 主体颜色
 * @param accent 色块的颜色
 */
export function figure(body = '#9aa3a8', accent = '#18d1ff'): string {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
      <defs><clipPath id="f"><path d="${FIGURE}"/></clipPath></defs>
      <path d="${FIGURE}" fill="${body}"/>
      <g clip-path="url(#f)">
        <path d="M0 96 100 70v22L0 118z" fill="#000" fill-opacity=".28"/>
        <path d="M0 150h100v50H0z" fill="#000" fill-opacity=".18"/>
        <path d="M58 100h30v6H58z" fill="${accent}"/>
        <path d="M36 28h28v5H36z" fill="#000" fill-opacity=".35"/>
      </g>
    </svg>`,
  )
}

/**
 * 场景图：一片渐变的天，远处几栋楼的剪影，前景一条斜坡。铺满时两边会被裁掉。
 *
 * @param sky 天空的颜色（上）
 * @param ground 近处的颜色（下）
 * @param light 光源的颜色
 */
export function scene(sky = '#465560', ground = '#1c2226', light = '#aebcc4'): string {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${ground}"/>
        </linearGradient>
      </defs>
      <path d="M0 0h640v360H0z" fill="url(#s)"/>
      <circle cx="440" cy="110" r="64" fill="${light}" fill-opacity=".5"/>
      <g fill="${ground}" fill-opacity=".55">
        <path d="M40 150h56v210H40zM110 190h40v170h-40zM170 120h72v240h-72zM262 210h48v150h-48z"/>
        <path d="M356 170h64v190h-64zM438 230h44v130h-44zM500 140h80v220h-80z"/>
      </g>
      <path d="M0 360V290l220-60 180 40 240-70v160z" fill="${ground}"/>
      <path d="M0 290l220-60 180 40 240-70" fill="none" stroke="${light}" stroke-opacity=".35"/>
    </svg>`,
  )
}

/** 四张色调不同的场景，给条带切图用。 */
export const scenes = [
  scene('#3e4a52', '#161b1e', '#9fb1ba'),
  scene('#5a5148', '#1d1a17', '#c9b9a3'),
  scene('#40504a', '#151b19', '#a6bdb2'),
  scene('#56505c', '#1b191e', '#bdb4c6'),
]
