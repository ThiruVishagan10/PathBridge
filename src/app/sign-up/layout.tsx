export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary font-mono tracking-wider">PathBridge</h1>
      </div>
      {children}
    </div>
  );
}