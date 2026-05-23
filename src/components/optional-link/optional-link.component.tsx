import Link from "next/link";
import { ReactNode } from "react";

interface Props extends Omit<
	React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>,
	"href"
> {
	href: string | null;
	children?: ReactNode;
}

export function OptionalLink({ href, children, ...props }: Props) {
	if (href) {
		return (
			<Link href={href} {...props}>
				{children}
			</Link>
		);
	}

	return <span {...props}>{children}</span>;
}
