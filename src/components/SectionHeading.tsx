interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  heading,
  align = 'left',
  light = false,
}) => {
  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align];

  return (
    <div className={`flex flex-col ${alignClass}`}>
      {/* Eyebrow */}
      {eyebrow && (
        <span
          className={`text-xs font-body font-semibold tracking-[0.2em] uppercase mb-4 ${
            light ? 'text-terracotta-light' : 'text-primary'
          }`}
        >
          {eyebrow}
        </span>
      )}

      {/* Heading */}
      <h2
        className={`font-heading text-3xl md:text-4xl xl:text-5xl font-bold leading-tight mb-6 ${
          light ? 'text-white' : 'text-foreground'
        }`}
      >
        {heading}
      </h2>

      {/* Decorative rule */}
      <div
        className={`flex items-center gap-3 mb-8 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <div className={`w-10 h-0.5 ${light ? 'bg-white/50' : 'bg-primary'}`} />
        <div
          className={`w-2 h-2 rounded-full opacity-40 ${
            light ? 'bg-white' : 'bg-primary'
          }`}
        />
      </div>
    </div>
  );
};

export default SectionHeading;
