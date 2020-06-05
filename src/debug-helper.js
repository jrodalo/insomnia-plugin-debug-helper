module.exports = function (context) {

    const config = context.request.getEnvironmentVariable('DEBUG_HELPER') || {};

    if (!config.REQUEST_ID_HEADER || !config.DEBUG_URL) {
        const { title, message } = require('./help');
        context.app.dialog(title, createHtmlElementWith(message));
        return;
    }

    const httpStatus = context.response.getStatusCode();
    const requestId = context.response.getHeader(config.REQUEST_ID_HEADER);

    if (httpStatus >= 400 && requestId) {
        const content = `
            <div class="pad">
                <div class="notice error text-left">
                    <pre>${context.response.getBody().toString()}</pre>
                </div>
                <p class="pad-top">
                    <a href="${config.DEBUG_URL.replace(/__REQUEST_ID__/, requestId)}">
                        View more details
                        <i class="fa fa-external-link"></i>
                    </a>
                </p>
            </div>
        `;

        context.app.dialog(`Request ID: ${requestId}`, createHtmlElementWith(content));
    }
};

function createHtmlElementWith(content) {
    const element = document.createElement('div');
    element.innerHTML = content;
    return element;
}
