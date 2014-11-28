network_name = "CPC to Profit";

network_img_file = "nw_img/cpc_to_profit.png"

network_vars = {
        a: {
            links: [],
            value: 100.00,
            viewname: 'a',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        b: {
            links: [],
            value: 3.00,
            viewname: 'b',
            minvalue: 1.00,
            maxvalue: 5.00,
            step: 0.01
        },

        CPC: {
            links: [],
            value: 0.10,
            viewname: 'CPC',
            minvalue: 0.01,
            maxvalue: 4.00,
            step: 0.01
        },

        clicks: {
            links: [
                {inputs: ['a', 'b', 'CPC'],
                relation: 'multiply_power'}
            ],
            value: 111.6123,
            viewname: 'clicks',
            minvalue: 1,
            maxvalue: 4000,
            step: 0.01
        },

        RPC: {
            links: [],
            value: 2.00,
            viewname: 'RPC',
            minvalue: 0.01,
            maxvalue: 4.00,
            step: 0.01
        },

        rev: {
            links: [
                {inputs: ['clicks', 'RPC'],
                relation: 'multiply'}
            ],
            value: 223.22463,
            viewname: 'rev',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        cost: {
            links: [
                {inputs: ['clicks', 'CPC'],
                relation: 'multiply'}
            ],
            value: 11.16123,
            viewname: 'cost',
            minvalue: 0.01,
            maxvalue: 4000,
            step: 0.01
        },
        profit: {
            links: [{
                inputs: ['rev', 'cost'],
                relation: 'minus'
            }],
            value: 212.0634,
            viewname: 'profit',
            minvalue: -2000,
            maxvalue: 600,
            step: 0.01
        }
    }

network_general_info = "This network shows how you get from CPC to profit. \
More CPC gets you more clicks (here through the formula clicks = a * CPC^b), therefore more revenue. <br>\
But this also means that you get more costs.<br>\
<p>\
So where's the tradeoff? Where can you maximize profit? \
Or (if it's what you want) get a maximum of revenue at break even (that is, profit=0)?\
"
