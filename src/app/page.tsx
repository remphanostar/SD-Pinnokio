export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <img
          src="/logo.svg"
          alt="Z.ai Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Z.ai Development</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A comprehensive development environment with integrated tools and services
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/sd-pinnokio" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            SD-Pinnokio Manager
          </a>
          <a href="/examples/websocket" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            WebSocket Demo
          </a>
        </div>
      </div>
    </div>
  )
}