import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionItem,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Divider,
  Heading,
  MicroText,
  Nav,
  NavGroup,
  NavItem,
  Notice,
  Prose,
  Serial,
  Step,
  Steps,
  Tag,
} from './index'

// 不是组件，只是把组件按一篇文档页的编排拼在一起：顶上一排导航，左边目录，中间正文。
// 阅读型的页面用亮色主题；装饰只留编号和分隔线的起点（内容型页面的密度）。
// 文案是演示用的占位内容。
const meta = {
  title: '示例/文档页',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  // 阅读与工具型的页面用亮色；工具栏里可以切回暗色看同一页
  globals: { theme: 'light' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Docs: Story = {
  name: '文档页',
  render: () => (
    <div className="mx-auto grid max-w-6xl gap-ark-6">
      <header className="flex items-center gap-ark-5 border-b border-ark-rule pb-ark-4">
        <span className="font-ark-latin-wide text-ark-base font-ark-bold">ARKNIGHTS-UI</span>
        <Nav aria-label="主导航" size="md" indicator className="ml-auto">
          <NavItem href="#guide" sub="指南" current>
            GUIDE
          </NavItem>
          <NavItem href="#components" sub="组件">
            COMPONENTS
          </NavItem>
          <NavItem href="#tokens" sub="变量">
            TOKENS
          </NavItem>
        </Nav>
      </header>

      <div className="grid items-start gap-ark-7 md:grid-cols-[13rem_minmax(0,1fr)]">
        <Nav orientation="vertical" aria-label="目录" className="max-md:hidden">
          <NavGroup label="Getting Started" className="pt-0">
            <NavItem href="#intro">简介</NavItem>
            <NavItem href="#install" current>
              接入
            </NavItem>
            <NavItem href="#theme">主题</NavItem>
          </NavGroup>
          <NavGroup label="Foundations">
            <NavItem href="#color">色彩</NavItem>
            <NavItem href="#type">字体与排版</NavItem>
            <NavItem href="#geometry">几何语言</NavItem>
          </NavGroup>
        </Nav>

        <article className="grid min-w-0 gap-ark-6">
          <div className="grid gap-ark-4">
            <Breadcrumb>
              <BreadcrumbItem href="#guide">指南</BreadcrumbItem>
              <BreadcrumbItem href="#start">开始使用</BreadcrumbItem>
              <BreadcrumbItem current>接入</BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" size="md" sub="GETTING STARTED" bar>
              接入
            </Heading>
            <div className="flex items-center gap-ark-3">
              <Tag variant="solid">v0.1</Tag>
              <Serial prefix="DOC." value={12} pad={4} className="text-ark-fg-muted" />
            </div>
          </div>

          <Notice title="非官方项目">
            本库不含任何官方素材：没有 Logo、立绘、图标或字体文件，图形全部是代码画的几何形状。
          </Notice>

          <Steps current={1} aria-label="接入步骤">
            <Step title="安装" sub="Install" />
            <Step title="引入样式" sub="Styles" />
            <Step title="设定主题" sub="Theme" />
            <Step title="开始使用" sub="Use" />
          </Steps>

          <Prose numbered>
            <h2>引入样式</h2>
            <p>
              样式有两种接法。项目没有用 Tailwind 时，引入预编译的样式表即可；它不含全局重置，
              不会改动页面上的其他元素。用了 Tailwind CSS v4 的项目改为引入主题层，
              让组件用到的类由自己的 Tailwind 一起生成。
            </p>
            <blockquote>组件不设置页面级样式：页面的底色和字体需要自己定。</blockquote>
            <h2>设定主题</h2>
            <p>
              在任意祖先元素上写 <code>data-ark-theme</code>：<code>dark</code> 是默认的黑底，
              <code>light</code> 是纸白，<code>auto</code> 跟随系统。沉浸型的页面用暗色，
              阅读与工具型的页面用亮色。
            </p>
            <ul>
              <li>黑白灰承担九成，一个信号色只负责“标记”。</li>
              <li>骨架上的东西一律直角，分区靠 1px 的细线。</li>
              <li>数字用数据体，要大、要带分母和前导零。</li>
            </ul>
          </Prose>

          <section className="grid gap-ark-4">
            <Divider start="bar" label="FAQ" />
            <Accordion exclusive numbered>
              <AccordionItem title="可以只用 tokens 吗" sub="Tokens only">
                可以。tokens.css 自带明暗两套语义变量，不依赖组件库。
              </AccordionItem>
              <AccordionItem title="怎么换信号色" sub="Signal">
                在任意子树上覆盖 --ark-signal，里面的组件都会跟着换。
              </AccordionItem>
              <AccordionItem title="游戏画面的组件在哪" sub="Game entry">
                在单独的入口里，只按暗色设计，不随主入口演进。
              </AccordionItem>
            </Accordion>
          </section>

          <footer className="flex items-center justify-between gap-ark-4 border-t border-ark-rule pt-ark-5">
            <Button variant="ghost" href="#intro">
              上一篇 · 简介
            </Button>
            <MicroText className="text-ark-fg-muted max-md:hidden">
              {'ARKNIGHTS-UI // DOCS'}
            </MicroText>
            <Button variant="subtle" href="#theme" arrow>
              下一篇 · 主题
            </Button>
          </footer>
        </article>
      </div>
    </div>
  ),
}
