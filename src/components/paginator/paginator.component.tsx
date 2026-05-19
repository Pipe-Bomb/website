import { IconButton } from "@/components/icon-button/icon-button";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import styles from "./paginator.module.scss";
import { useUrlPagination } from "@hook/url-pagination";

interface Props {
	urlKey: string;
}

export function Paginator({ urlKey }: Props) {
	const { currentPage, setPage } = useUrlPagination(urlKey);

	return (
		<div className={styles.container}>
			<IconButton
				icon={IconCaretLeftFilled}
				onClick={() => setPage(currentPage - 1)}
				iconSource="tabler"
			/>
			<span className={styles.pageNumber}>{currentPage}</span>
			<IconButton
				icon={IconCaretRightFilled}
				onClick={() => setPage(currentPage + 1)}
				iconSource="tabler"
			/>
		</div>
	);
}
