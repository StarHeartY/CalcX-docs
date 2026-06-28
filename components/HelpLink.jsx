export default function HelpLink({ href, title }) {
  return (
    <a
      href={href}
      className="annotation-link"
      /* title 属性会在鼠标悬停时弹出一个原生的黑色小提示框 */
      title={title || "点击查看详情"}
    >
      {/* 这是一个极其精美的带圈问号 SVG 图标 */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </a>
  );
}