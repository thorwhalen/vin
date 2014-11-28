network_name = "Impressions to Sales";

network_img_file = "nw_img/example_network_with_manual.png"

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
            maxvalue: 4000,
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

network_general_info = "The specific network is a simple impressions to clicks funnel, \
where impressions become clicks via a ctr (click thru rate) and clicks become sales through a cvr (conversion rate). <br>\
<p>\
You can change values of each of the parameters and observe the effects on others. \
The effects are only ordered according to the order of the variables are displayed on the page. \
You can change this order by dragging variable containers to different positions. <br>\
<p>\
In a nutshell, higher variables are used as causal or explanatory variables of lower ones. \
(Technical detail: The reason for needing some kind of ordering is that of multiple choices of tree traversal). \
<p>\
For example, say you want to know how many clicks you’d need to get to be able to make a given number of sales. \
\
In the original order, if you edit sales, this will have no effect on clicks. This is because clicks is above sales. \
\
If you drag clicks to be below sales, changing sales will now change clicks. \
\
The number of clicks you see is the number of clicks you’d need for the sales you specified, at the given cvr (conversion rate). \
\
Try increasing cvr now, and see that (with the same number of sales) you need less clicks. \
<p>\
But now the impressions and ctr are not aligned with these clicks. <br>\
This is because clicks is below imps and ctr. <br>\
If you wanted to see what ctr you’d need to reach, for those clicks, with the impressions you have, <br>\
you’d need to drag ctr below clicks and do what you just did. <br>\
<p>\
<p>\
<em>Building your own network you want?</em><br>\
<br>\
If you want to try to write your own network, this is what you need to do.  <br>\
<ul>\
   <li>Copy js/imps_to_sale.js (within the js/ folder) calling the copy something original. Say, foo.js</li>\
   <li>Change the variables in the file to match the network specification you want (name, info, image file, vars)</li>\
   <li>Copy imps_to_sale.html, calling it foo.html</li>\
   <li>Look for the comment 'EDIT: Network JS' and change the name of the file from imps_to_sale.js to foo.js</li>\
   <li>Edit index.html, adding this new great network of yours</li>\
   <li>Now go to foo.html and watch your network break!</li>\
</ul>\
<p>\
Wait a minute! Not so fast! What the hell is this network_vars?!? That's the json-like variable in foo.js that does it all.\
<p>\
This variable is a JSON of elements such as: <br>\
<p>\
clicks: { \
            links: [{ \
                inputs: ['imps', 'ctr'], \
                relation: 'multiply' \
            }, { \
                inputs: ['sales', 'cvr'], \
                relation: 'divide' \
            }], \
            value: 50.0, \
            viewname: 'clicks', \
            minvalue: 0.01, \
            maxvalue: 1000, \
            step: 0.001 \
        }, \
<p>\
Edit clicks (in key and in viewname value) to change the name. <br>\
Edit value to set a new default value. <br>\
minvalue, maxvalue, and step are for the slider. <br>\
But now the important part. <br>\
You need to specify how this variable (node_name) is connected to others through the link field.  <br>\
The link field contains a list of {inputs, relations} which specify a “relations” function that should take said inputs (variables) to compute clicks.  <br>\
The reason there is several relations, is that clicks can be computed as imps * ctr or sales / cvr.  <br>\
—> If you want the network to be able to compute in any order, you need to specify ALL relations. <br>\
—> The relation that is used to compute is the first one that will be found with all inputs ABOVE the variable that needs to be computed.  <br>\
So, when clicks is recomputed, the program looks to see if imps and ctr are above (on the screen), <br> \
if there not, the program looks to see if sales and cvr are above clicks, and if they are, these are used to recompute clicks.  <br>\
<p>\
"
