network_name = "Impressions to Sales";

network_img_file = "nw_img/imps_to_sales.png"

network_vars = {
        imps: {
            links: [{
                inputs: ['ctr', 'clicks'],
                relation: 'multiply'
            }],
            value: 1000.0,
            viewname: 'imps',
            minvalue: 0.01,
            maxvalue: 20000,
            step: 0.001
        },

        ctr: {
            links: [{
                inputs: ['clicks', 'imps'],
                relation: 'divide'
            }],
            value: 0.05,
            viewname: 'ctr',
            minvalue: 0.0001,
            maxvalue: 1,
            step: 0.0001
        },

        clicks: {
            links: [{
                inputs: ['imps', 'ctr'],
                relation: 'multiply'
            }, {
                inputs: ['sales', 'cvr'],
                relation: 'divide'
            }],
            value: 50.0,
            viewname: 'clicks',
            minvalue: 0.01,
            maxvalue: 5000,
            step: 0.001
        },

        cvr: {
            links: [{
                inputs: ['sales', 'clicks'],
                relation: 'divide'
            }],
            value: 0.02,
            viewname: 'cvr',
            minvalue: 0.0001,
            maxvalue: 1,
            step: 0.0001
        },

        sales: {
            links: [{
                inputs: ['clicks', 'cvr'],
                relation: 'multiply'
            }],
            value: 1.0,
            viewname: 'sales',
            minvalue: 0.01,
            maxvalue: 100,
            step: 0.001
        }
    }

network_general_info = "The network is a simple impressions to clicks funnel, \
where impressions become clicks via a ctr (click thru rate) and clicks become sales through a cvr (conversion rate). <br>\
<p>\
"
