
import moment from 'moment'

export const dateFromNow = (date: Date) => {
    return moment(date, "YYYYMMDD").fromNow()
        .replace('seconds', 'segundos')
        .replace('minute', 'minuto')
        .replace('minutes', 'minutos')
        .replace('hour', 'hora')
        .replace('hours', 'horas')
        .replace('day', 'dia')
        .replace('days', 'dias')
        .replace('month', 'mês')
        .replace('months', 'meses')
        .replace('year', 'ano')
        .replace('years', 'anos')
        .replace('ago', '')
}