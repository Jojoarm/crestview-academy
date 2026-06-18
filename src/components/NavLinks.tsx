import Image from 'next/image';

interface NavLinksProps {
  link: string;
  alt: string;
  icon: string;
  extraStyling?: string;
  width?: number;
  height?: number;
}
const NavLinks: React.FC<NavLinksProps> = ({
  link,
  icon,
  alt,
  extraStyling,
  width = 18,
  height = 18,
}) => {
  return (
    <a
      className={`cursor-pointer hover:-translate-y-0.5 transition-all duration-300 ${extraStyling}`}
      target="_blank"
      href={link}
    >
      <Image src={icon} width={width} height={height} alt={alt} />
    </a>
  );
};

export default NavLinks;
