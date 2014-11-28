network_name = "Two CPC to Profit Networks";

network_img_file = "nw_img/two_cpc_to_profit.png"

network_vars = {
        a1: {
            links: [],
            value: 100.00,
            viewname: 'a1',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        a2: {
            links: [],
            value: 100.00,
            viewname: 'a2',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        b1: {
            links: [],
            value: 3.00,
            viewname: 'b1',
            minvalue: 1.00,
            maxvalue: 5.00,
            step: 0.01
        },

        b2: {
            links: [],
            value: 3.00,
            viewname: 'b2',
            minvalue: 1.00,
            maxvalue: 5.00,
            step: 0.01
        },

        RPC1: {
            links: [],
            value: 0.5,
            viewname: 'RPC1',
            minvalue: 0.01,
            maxvalue: 4.00,
            step: 0.01
        },

        RPC2: {
            links: [],
            value: 1.5,
            viewname: 'RPC2',
            minvalue: 0.01,
            maxvalue: 4.00,
            step: 0.01
        },

        CPC1: {
            links: [],
            value: 1.00,
            viewname: 'CPC1',
            minvalue: 0.01,
            maxvalue: 4.00,
            step: 0.01
        },

        CPC2: {
            links: [],
            value: 1.00,
            viewname: 'CPC2',
            minvalue: 0.01,
            maxvalue: 4.00,
            step: 0.01
        },

        clicks1: {
            links: [
                {inputs: ['a1', 'b1', 'CPC1'],
                relation: 'multiply_power'}
            ],
            value: 300,
            viewname: 'clicks1',
            minvalue: 1,
            maxvalue: 4000,
            step: 0.01
        },

        clicks2: {
            links: [
                {inputs: ['a2', 'b2', 'CPC2'],
                relation: 'multiply_power'}
            ],
            value: 300,
            viewname: 'clicks2',
            minvalue: 1,
            maxvalue: 4000,
            step: 0.01
        },

        rev1: {
            links: [
                {inputs: ['clicks1', 'RPC1'],
                relation: 'multiply'}
            ],
            value: 150,
            viewname: 'rev1',
            minvalue: 0.01,
            maxvalue: 1000,
            step: 0.01
        },

        rev2: {
            links: [
                {inputs: ['clicks2', 'RPC2'],
                relation: 'multiply'}
            ],
            value: 450,
            viewname: 'rev2',
            minvalue: 0.01,
            maxvalue: 1000,
            step: 0.01
        },

        cost1: {
            links: [
                {inputs: ['clicks1', 'CPC1'],
                relation: 'multiply'}
            ],
            value: 300,
            viewname: 'cost1',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        cost2: {
            links: [
                {inputs: ['clicks2', 'CPC2'],
                relation: 'multiply'}
            ],
            value: 300,
            viewname: 'cost2',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        profit1: {
            links: [{
                inputs: ['rev1', 'cost1'],
                relation: 'minus'
            }],
            value: -150,
            viewname: 'profit1',
            minvalue: -2000,
            maxvalue: 600,
            step: 0.01
        },

        profit2: {
            links: [{
                inputs: ['rev2', 'cost2'],
                relation: 'minus'
            }],
            value: 150,
            viewname: 'profit2',
            minvalue: -2000,
            maxvalue: 600,
            step: 0.01
        },

        rev: {
            links: [
                {inputs: ['rev1', 'rev2'],
                relation: 'plus'}
            ],
            value: 600,
            viewname: 'rev',
            minvalue: 0.01,
            maxvalue: 2000,
            step: 0.01
        },

        profit: {
            links: [{
                inputs: ['profit1', 'profit2'],
                relation: 'plus'
            }],
            value: 0,
            viewname: 'profit',
            minvalue: -2000,
            maxvalue: 600,
            step: 0.01
        }
    }

network_general_info = "This network combines two 'cpc to profit' networks. \
<p>\
It is useful to be able to see the advantage of setting the CPC granularly.\
"
