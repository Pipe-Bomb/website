import {
	BooleanSmartFilterDto,
	BufferSmartFilterDto,
	DecimalSmartFilterDto,
	IntegerSmartFilterDto,
	StringSmartFilterDto,
} from "@api";

export type SmartFilterDto =
	| StringSmartFilterDto
	| BooleanSmartFilterDto
	| IntegerSmartFilterDto
	| DecimalSmartFilterDto
	| BufferSmartFilterDto;
