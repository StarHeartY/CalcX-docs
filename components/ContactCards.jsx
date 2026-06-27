export default function ContactCards() {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px', marginBottom: '32px' }}>
      <a href="https://calcx.startyi.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '6px 20px', border: '2px solid #1a1a1a', borderRadius: '14px', textDecoration: 'none', color: '#1a1a1a', backgroundColor: '#fff', height: '52px', boxSizing: 'border-box' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1', letterSpacing: '0.5px', color: '#666' }}>官方主页</span>
          <span style={{ fontSize: '15px', fontWeight: '900', lineHeight: '1.2' }}>calcx.startyi.com</span>
        </span>
      </a>

      <a href="https://github.com/StarHeartY/CalculatorX" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '6px 20px', borderRadius: '14px', textDecoration: 'none', color: '#fff', backgroundColor: '#24292e', height: '52px', boxSizing: 'border-box' }}>
        <svg height="24" aria-hidden="true" viewBox="0 0 16 16" width="24" fill="currentColor" style={{ marginRight: '12px' }}><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1', letterSpacing: '0.5px', color: '#a1a1aa' }}>开源地址</span>
          <span style={{ fontSize: '15px', fontWeight: '900', lineHeight: '1.2' }}>GitHub 仓库</span>
        </span>
      </a>

      <a href="mailto:support@startyi.com" style={{ display: 'flex', alignItems: 'center', padding: '6px 20px', border: '2px solid #1a1a1a', borderRadius: '14px', textDecoration: 'none', color: '#1a1a1a', backgroundColor: '#fff', height: '52px', boxSizing: 'border-box' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1', letterSpacing: '0.5px', color: '#666' }}>联系邮箱</span>
          <span style={{ fontSize: '15px', fontWeight: '900', lineHeight: '1.2' }}>support@startyi.com</span>
        </span>
      </a>
    </div>
  );
}