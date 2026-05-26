import {
	StringSearchAttributeDto,
	BooleanSearchAttributeDto,
	IntegerSearchAttributeDto,
	DecimalSearchAttributeDto,
	BufferSearchAttributeDto,
} from "@api";

export type SearchAttributeDto =
	| StringSearchAttributeDto
	| BooleanSearchAttributeDto
	| IntegerSearchAttributeDto
	| DecimalSearchAttributeDto
	| BufferSearchAttributeDto;
