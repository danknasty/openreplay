import React from 'react';
import { Loader, NoContent } from 'UI';
import { widgetHOC, domain, Styles } from '../common';
import { numberWithCommas} from 'App/utils';
import { 
  BarChart, Bar, CartesianGrid, Tooltip,
  LineChart, Line, Legend, ResponsiveContainer, 
  XAxis, YAxis
} from 'recharts';
import { LAST_24_HOURS, LAST_30_MINUTES, YESTERDAY, LAST_7_DAYS } from 'Types/app/period';

const customParams = rangeName => {
  const params = { density: 28 }

  if (rangeName === LAST_24_HOURS) params.density = 21
  if (rangeName === LAST_30_MINUTES) params.density = 28
  if (rangeName === YESTERDAY) params.density = 28
  if (rangeName === LAST_7_DAYS) params.density = 28
  
  return params
}

@widgetHOC('errorsPerType', { fullwidth: true, customParams })
export default class ErrorsByType extends React.PureComponent {
  render() {
    const { data, loading, period, compare = false, showSync = false } = this.props;
    const colors = compare ? Styles.compareColors : Styles.colors;
    const params = customParams(period.rangeName)

    return (
      <Loader loading={ loading } size="small">
        <NoContent
          size="small"
          title="No recordings found"
          show={ data.chart.length === 0 }
        >
          <ResponsiveContainer height={ 240 } width="100%">
            <BarChart
              data={data.chart}
              margin={Styles.chartMargins}
              syncId="errorsPerType"
              syncId={ showSync ? "errorsPerType" : undefined }
            >
              <CartesianGrid strokeDasharray="3 3" vertical={ false } stroke="#EEEEEE" />
              <XAxis {...Styles.xaxis} dataKey="time" interval={params.density/7} />
              <YAxis
                {...Styles.yaxis}
                label={{ ...Styles.axisLabelLeft, value: "Number of Errors" }}
                allowDecimals={false}
              />
              <Legend />
              <Tooltip {...Styles.tooltip} />
              <Bar minPointSize={1} name="Integrations" dataKey="integrations" stackId="a" fill={colors[0]}/>
              <Bar name="4xx" dataKey="4xx" stackId="a" fill={colors[1]} />
              <Bar name="5xx" dataKey="5xx" stackId="a" fill={colors[2]} />
              <Bar name="Javascript" dataKey="js" stackId="a" fill={colors[3]} />
            </BarChart>
          </ResponsiveContainer>
        </NoContent>
      </Loader>
    );
  }
}
