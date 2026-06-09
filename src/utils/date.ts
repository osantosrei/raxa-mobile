import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatMatchDate(value: string) {
  const date = new Date(value);

  if (!isValid(date)) {
    return 'Data a confirmar';
  }

  return format(date, "dd 'de' MMMM, HH:mm", { locale: ptBR });
}

export function toDateInputValue(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function toTimeInputValue(date: Date) {
  return format(date, 'HH:mm');
}

export function parseLocalDateTime(dateValue: string, timeValue: string) {
  return parse(`${dateValue} ${timeValue}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function toApiDateTime(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}
