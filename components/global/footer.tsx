export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 px-6 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center text-sm text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} MotionDesk</span>
      </div>
    </footer>
  );
}
