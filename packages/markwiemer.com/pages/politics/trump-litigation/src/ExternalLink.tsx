import { Link } from "@fluentui/react-components";

export const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
}) => {
    return (
        <Link href={href} target="_blank" rel="noreferrer noreferrer">
            {children}
        </Link>
        // todo add icon to indicate external link
    );
};
