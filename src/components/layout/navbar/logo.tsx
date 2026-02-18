import Link from "next/link";

export const Logo = () => (
	<Link href="/" className="inline-block" aria-label="iFluxArt - 首页">
		<h2 className="font-bold text-sm tracking-wide transition-colors hover:text-primary sm:text-md md:text-lg">
			iFluxArt
		</h2>
	</Link>
);
