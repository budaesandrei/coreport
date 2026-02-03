import { useEffect, useMemo, useState } from 'react'
import logo from './assets/coreport-logo.svg'
import './App.css'

type ThemeMode = 'system' | 'light' | 'dark'

type NavKey =
  | 'dashboard'
  | 'orgs'
  | 'users'
  | 'entities'
  | 'reportPackages'
  | 'reportTypes'
  | 'uploads'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'system') {
    root.removeAttribute('data-theme')
    return
  }
  root.setAttribute('data-theme', mode)
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [tenantId, setTenantId] = useState('default')
  const [userName, setUserName] = useState('alice')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('coreport.theme') as ThemeMode) || 'system'
  })
  const [nav, setNav] = useState<NavKey>('dashboard')
  const [whoami, setWhoami] = useState<{ tenant_id: string; user_name: string } | null>(null)

  useEffect(() => {
    localStorage.setItem('coreport.theme', theme)
    applyTheme(theme)
  }, [theme])

  const headers = useMemo(() => {
    return {
      'X-Tenant-Id': tenantId,
      'X-User-Name': userName,
    }
  }, [tenantId, userName])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/whoami`, { headers })
        const data = await res.json()
        setWhoami(data)
      } catch {
        setWhoami(null)
      }
    })()
  }, [headers])

  return (
    <div className="layout">
      <aside className={sidebarOpen ? 'sidebar' : 'sidebar collapsed'}>
        <div className="brand" onClick={() => setSidebarOpen((v) => !v)}>
          <img className="logo" src={logo} alt="Coreport" />
          {sidebarOpen && (
            <div className="brandText">
              <div className="brandName">Coreport</div>
              <div className="brandTag">Core report SaaS prototype</div>
            </div>
          )}
        </div>

        <nav className="nav">
          <NavItem active={nav === 'dashboard'} label="Dashboard" onClick={() => setNav('dashboard')} collapsed={!sidebarOpen} />
          <NavItem active={nav === 'orgs'} label="Orgs" onClick={() => setNav('orgs')} collapsed={!sidebarOpen} />
          <NavItem active={nav === 'users'} label="Users" onClick={() => setNav('users')} collapsed={!sidebarOpen} />
          <NavItem active={nav === 'entities'} label="Entities" onClick={() => setNav('entities')} collapsed={!sidebarOpen} />
          <NavItem active={nav === 'reportPackages'} label="Report Packages" onClick={() => setNav('reportPackages')} collapsed={!sidebarOpen} />
          <NavItem active={nav === 'reportTypes'} label="Report Types" onClick={() => setNav('reportTypes')} collapsed={!sidebarOpen} />
          <NavItem active={nav === 'uploads'} label="Uploads" onClick={() => setNav('uploads')} collapsed={!sidebarOpen} />
        </nav>

        <div className="sidebarFooter">
          <div className="hint">Headers sent:</div>
          <div className="mono">X-Tenant-Id: {tenantId}</div>
          <div className="mono">X-User-Name: {userName}</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="iconBtn" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
            ☰
          </button>

          <div className="spacer" />

          <div className="switchers">
            <label className="field">
              <span>Tenant</span>
              <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="default" />
            </label>
            <label className="field">
              <span>User</span>
              <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="alice" />
            </label>
            <label className="field">
              <span>Theme</span>
              <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeMode)}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </header>

        <section className="content">
          <h1>{titleFor(nav)}</h1>
          <p className="muted">
            This UI is intentionally thin: it demonstrates multi-tenant headers + a portal shell.
          </p>

          <div className="grid">
            <Card title="Backend status">
              <div className="mono">API_BASE: {API_BASE}</div>
              <div className="mono">whoami: {whoami ? JSON.stringify(whoami) : 'unreachable'}</div>
              <div className="muted">Try: /api/v1/tenants, /api/v1/orgs, /api/v1/uploads</div>
            </Card>

            <Card title="Next (demo flow)">
              <ol className="list">
                <li>docker compose up --build</li>
                <li>make migrate</li>
                <li>make seed</li>
                <li>Use the Admin pages to view seeded tenants/orgs/users</li>
              </ol>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

function NavItem(props: { active: boolean; label: string; onClick: () => void; collapsed: boolean }) {
  return (
    <button className={props.active ? 'navItem active' : 'navItem'} onClick={props.onClick}>
      <span className="navIcon">◼</span>
      {!props.collapsed && <span>{props.label}</span>}
    </button>
  )
}

function Card(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="cardTitle">{props.title}</div>
      <div className="cardBody">{props.children}</div>
    </div>
  )
}

function titleFor(nav: NavKey): string {
  switch (nav) {
    case 'dashboard':
      return 'Dashboard'
    case 'orgs':
      return 'Orgs'
    case 'users':
      return 'Users'
    case 'entities':
      return 'Entities'
    case 'reportPackages':
      return 'Report Packages'
    case 'reportTypes':
      return 'Report Types'
    case 'uploads':
      return 'Uploads'
  }
}
