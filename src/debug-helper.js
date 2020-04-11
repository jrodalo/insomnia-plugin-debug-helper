module.exports = function (context) {

    const config = context.request.getEnvironmentVariable('DEBUG_HELPER') || {};

    if (!config.REQUEST_ID_HEADER || !config.DEBUG_URL) {
        const { title, message } = require('./help');
        context.app.showGenericModalDialog(title, { html: message });
        return;
    }

    const httpStatus = context.response.getStatusCode();
    const requestId = context.response.getHeader(config.REQUEST_ID_HEADER);

    if (httpStatus >= 400 && requestId) {
        const content = `
            <pre>${context.response.getBody().toString()}</pre>
            <p><a href="${config.DEBUG_URL.replace(/__REQUEST_ID__/, requestId)}">View more details</a></p>
        `;

        context.app.showGenericModalDialog(`Request ID: ${requestId}`, { html: content });
    }
};
