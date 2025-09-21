import { criticalCSS } from '@/lib/critical-css';

export default function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: criticalCSS,
      }}
    />
  );
}