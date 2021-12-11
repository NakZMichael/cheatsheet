export interface Action<Type extends string, Payload>{
  type: Type,
  payload: Payload
}
