network_name = "Impressions to Sales";


network_vars = {
        cpc: {
            links: [{
                inputs: ['revenue', 'clicks'],
                relation: 'divide'
            }],
            value: 2.00,
            viewname: 'cpc',
            minvalue: 0.0001,
            maxvalue: 10,
            step: 0.0001
        },

        maxpartners: {
            // links: [{
            //     inputs: ['partners', 'cpc'],
            //     relation: 'divide'
            // }],
            value: 1000.0,
            viewname: 'maxpartners',
            minvalue: 0,
            maxvalue: 2000,
            step: 1
        },
        priceElasticity: {
            // links: [{
            //     inputs: ['partners', 'cpc'],
            //     relation: 'divide'
            // }],
            value: 120.0,
            viewname: 'priceElasticity',
            minvalue: 0,
            maxvalue: 200,
            step: 1
        },
        partners: {
            links: [{
                inputs: ['clicks', 'cpp', 'priceElasticity'],
                relation: 'f'
            },{
                inputs: ['maxpartners', 'cpc', 'priceElasticity'],
                relation: 'f'
            }],
            value: 500.0,
            viewname: 'partners',
            minvalue: 0.01,
            maxvalue: 10000,
            step: 0.001
        },


        cpp: {
            links: [{
                inputs: ['clicks', 'partners'],
                relation: 'divide'
            }],
            value: 250.0,
            viewname: 'cpp',
            minvalue: 0.0,
            maxvalue: 100000,
            step: 0.01
        },

        clicks: {
            links: [{
                inputs: ['partners', 'cpp'],
                relation: 'multiply'
            }, {
                inputs: ['revenue', 'cpp'],
                relation: 'divide'
            }],
            value: 125000.0,
            viewname: 'clicks',
            minvalue: 0.01,
            maxvalue: 100000,
            step: 0.001
        },



        revenue: {
            links: [{
                inputs: ['clicks', 'cpc'],
                relation: 'multiply'
            }],
            value: 250000.0,
            viewname: 'revenue',
            minvalue: 0.01,
            maxvalue: 1000000,
            step: 0.001
        }
    }

network_general_info = "The specific network is a simple representation of how\
the cpc might influence the number of Kieskeurig partners, the number of clicks\
and the revenue."
