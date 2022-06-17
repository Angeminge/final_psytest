import React from "react";
import {Container} from "@sberdevices/ui";
import {
    ReferenceLine,
    ScatterChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Dot,
    Scatter
} from "recharts";


export const PsyTestChart = (n, e, size) => {
    const data = [{ neuroticism: n, extravertism: e }];
    return (
        <Container aria-setsize={size} padding-left='inherit'>
        <ScatterChart
            width={size*0.8}
            height={size*0.8}
            data={data}
            fill="white"
            margin={{top: 30, right: 30, bottom: 30, left: 0}}
            position="left"
        >
            <CartesianGrid stroke="#606060" strokeDasharray="5 5"/>
            <Tooltip />
            <ReferenceLine x={12} stroke="#c5c5c5"
                           label={{value:"Нестабильный", position:"insideTop", dy:-25}}
            />
            <ReferenceLine y={12} stroke="gray"
                           label={{value:"Экстраверт", position:"right", angle:-90, dx:10, dy:40}}
            />

            <XAxis
                domain={[0,24]}
                dataKey="extravertism"
                type="number"
                name="Экстраверсия"
                axisLine={false}
                tickCount={7}
                label={{value:"Стабильный", position:"bottom"}}
            />

            <YAxis
                domain={[0,24]}
                dataKey="neuroticism"
                type="number"
                name="Нейротизм"
                axisLine={false}
                tickCount={7}
                label={{value:"Интроверт", position:"center", angle:-90, dx:-10}}
            />

            <Scatter dataKey="neuroticism" fill="#21A038" shape={<Dot r={10}/>}/>
        </ScatterChart>
        </Container>
    );
}
