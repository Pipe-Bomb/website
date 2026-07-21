"use client";

import {
	getGetUserPrivilegesQueryKey,
	updateUserPrivileges,
	useGetAllUsers,
	useGetUserPrivileges,
	User,
} from "@api";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import Loading from "@/app/loading";
import { ListPrivilege } from "@/components/list-privilege/list-privilege.component";
import { List } from "@/components/list/list.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { processPrivileges } from "@/lib/privilege.util";
import { safeFetch } from "@/lib/api.util";
import { useNotificationStore } from "@/store/notification.store";
import { useQueryClient } from "@tanstack/react-query";
import { usePrivilegeCheck } from "@/hook/privilege-check.hook";

export default function Page() {
	const [activeUser, setActiveUser] = useState<User | null>(null);

	const { data } = useGetAllUsers({
		query: {
			enabled: true,
		},
	});

	if (!data || data.status != 200) {
		return <Loading />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.userList}>
				{data.data.map((user) => (
					<button
						key={user.uuid}
						className={styles.userEntry}
						onClick={() => setActiveUser(user)}
					>
						<span>{user.username}</span>
					</button>
				))}
			</div>
			{activeUser && <UserSection user={activeUser} />}
		</div>
	);
}

interface UserSectionProps {
	user: User;
}

function UserSection({ user }: UserSectionProps) {
	const { createNotification } = useNotificationStore();
	const hasPrivilege = usePrivilegeCheck();
	const canEditPrivileges = hasPrivilege("*");
	const queryClient = useQueryClient();

	const { data } = useGetUserPrivileges(user.uuid, {
		query: {
			enabled: true,
		},
	});

	const [grants, setGrants] = useState<Record<string, boolean>>({});
	const [isUpdatingPrivileges, setIsUpdatingPrivileges] = useState(false);

	const privileges = useMemo(() => {
		if (data?.status != 200) {
			return [];
		}
		return processPrivileges(
			data.data.map((privilege) => ({
				...privilege,
				granted: !!grants[`${privilege.pluginId ?? ""}:${privilege.key}`],
			})),
		);
	}, [data, grants]);

	const privilegesNeedSaving = useMemo(() => {
		if (data?.status != 200) {
			return false;
		}
		for (const privilege of data.data) {
			if (
				grants[`${privilege.pluginId ?? ""}:${privilege.key}`] !==
				privilege.granted
			) {
				return true;
			}
		}
		return false;
	}, [data, grants]);

	useEffect(() => {
		if (data?.status == 200) {
			const grants: Record<string, boolean> = {};
			for (const privilege of data.data) {
				grants[`${privilege.pluginId ?? ""}:${privilege.key}`] =
					privilege.granted;
			}
			setGrants(grants);
		} else {
			setGrants({});
		}
	}, [data]);

	if (!data || data.status != 200) {
		return <Loading />;
	}

	const updatePrivileges = () => {
		if (isUpdatingPrivileges) {
			return;
		}
		setIsUpdatingPrivileges(true);

		safeFetch(updateUserPrivileges, user.uuid, {
			privileges: privileges.map((privilege) => ({
				pluginId: privilege.pluginId,
				key: privilege.key,
				granted: grants[`${privilege.pluginId ?? ""}:${privilege.key}`],
			})),
		}).then(([status, _data, response]) => {
			setIsUpdatingPrivileges(false);
			if (status == 200) {
				createNotification("Updated user privileges");
				queryClient.setQueryData(
					getGetUserPrivilegesQueryKey(user.uuid),
					response,
				);
			} else if (status == 409) {
				createNotification("You cannot modify your own privileges");
			} else {
				createNotification("Failed to update user privileges");
			}
		});
	};

	return (
		<>
			<h1 className={styles.username}>{user.username}</h1>
			{privilegesNeedSaving && (
				<IconButton
					icon={IconDeviceFloppy}
					iconSource="tabler"
					style="background"
					loading={isUpdatingPrivileges}
					onClick={updatePrivileges}
				/>
			)}
			<List>
				{privileges.map((privilege) => (
					<ListPrivilege
						key={`${privilege.pluginId ?? ""}:${privilege.key}`}
						privilege={privilege}
						setGranted={(granted) => {
							if (!privilege.grantedByInclusion) {
								setGrants((grants) => ({
									...grants,
									[`${privilege.pluginId ?? ""}:${privilege.key}`]: granted,
								}));
							}
						}}
						disabled={!canEditPrivileges || isUpdatingPrivileges}
					/>
				))}
			</List>
		</>
	);
}
