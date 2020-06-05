module.exports = {
    title: 'Debug Helper config missing',
    message: `
<div class="pad">
You need to create a new <a href="https://support.insomnia.rest/article/18-environment-variables">environment variable</a> like this:
<p>
<pre>
"DEBUG_HELPER": {
    "REQUEST_ID_HEADER": "my-request-id-header",
    "DEBUG_URL": "http://my-debug-service/search?id=__REQUEST_ID__"
}
</pre>
</p>
<ul>
    <li>* Replace "<i>my-request-id-header</i>" with the name of the header that contains your Request ID.</li>
    <li>* Replace the URL with yours using <i>__REQUEST_ID__</i> as a placeholder for the actual Request ID.</li>
</ul>
<p>Have a look at the <a href="https://github.com/jrodalo/insomnia-plugin-debug-helper">documentation</a> to see some examples.</p>
</div>
`
};
