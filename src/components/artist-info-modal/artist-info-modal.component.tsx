"use client";

import Modal from "@/components/modal/modal.component";
import { Artist } from "@api/model";
import styles from "./artist-info-modal.module.scss";
import { useAttribute } from "@/hook/attribute.hook";
import { useGetArtist } from "@api";
import { Spinner } from "@/components/spinner/spinner.component";
import { useTranslation } from "@/context/language.context";
import Link from "next/link";

interface Props extends InnerProps {
	open: boolean;
	onClose?: () => void;
}

export function ArtistInfoModal({ artist, open, onClose }: Props) {
	return (
		<Modal open={open} onClose={onClose} className={styles.container}>
			<Inner artist={artist} />
		</Modal>
	);
}

interface InnerProps {
	artist: Artist;
}

function Inner({ artist }: InnerProps) {
	const { data: fullArtistResponse } = useGetArtist(artist.uuid, {
		query: {
			enabled: true,
		},
	});

	if (!fullArtistResponse) {
		return (
			<div>
				<Spinner />
			</div>
		);
	}

	if (fullArtistResponse.status == 404) {
		return (
			<div>
				<span>Artist not found</span>
			</div>
		);
	}

	return <Content artist={fullArtistResponse.data} />;
}

function Content({ artist }: InnerProps) {
	const { t } = useTranslation();

	return (
		<div>
			<div>
				<h2>Identities</h2>
				{artist.identities?.map((identity) => (
					<div
						key={`${identity.pluginId} ${identity.identityId} ${identity.ordinal}`}
					>
						<span>{t(`plugin.${identity.pluginId}.name`)}</span>
						<span>{" > "}</span>
						<span>{identity.identityId}</span>
						<span className={styles.identityValue}>{identity.value}</span>
					</div>
				))}
			</div>
			<div>
				<h2>Attributes</h2>
				{Object.entries(artist.attributes ?? {}).map(
					([key, { type, values }]) => (
						<div key={key}>
							<span>{key}</span>
							{values.map((value, index) =>
								typeof value == "object" ? (
									<Link
										href={`http://127.0.0.1:3000${value.url}`}
										key={index}
										target="_blank"
										className={styles.identityValue}
									>
										{value.uuid}
									</Link>
								) : (
									<span key={index} className={styles.identityValue}>
										{value}
									</span>
								),
							)}
						</div>
					),
				)}
			</div>
		</div>
	);
}
