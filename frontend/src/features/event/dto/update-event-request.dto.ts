import { IActivityRecord } from '../types/event.types';
import { ICreateEventRequest } from './create-event-request.dto';

export interface IUpdateEventRequest extends Partial<ICreateEventRequest> {
	// Можно добавить дополнительные поля, если есть особые требования к обновлению
}
