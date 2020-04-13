const responseHook = require('..').responseHooks[0];

const validConfig = {
    REQUEST_ID_HEADER: 'request_id_header',
    DEBUG_URL: 'http://my-service?search=__REQUEST_ID__',
};

describe('Debug Helper', () => {

    it('shows a help message when configuration is missing', () => {
        const action = jest.fn();
        const context = new ContextBuilder()
            .withConfig(undefined)
            .withDialog(action)
            .build();

        responseHook(context);

        expect(action).toHaveBeenCalledWith(
            'Debug Helper config missing',
            expect.objectContaining(
                {
                    html: expect.any(String)
                }
            )
        );
    });

    it('does nothing when httpStatus < 400', () => {
        const action = jest.fn();
        const context = new ContextBuilder()
            .withConfig(validConfig)
            .withStatusCode(200)
            .withRequestId('11111111-2222-3333-4444-555555555555')
            .withDialog(action)
            .build();

        responseHook(context);

        expect(action).not.toHaveBeenCalled();
    });

    it('does nothing when no request id', () => {
        const action = jest.fn();
        const context = new ContextBuilder()
            .withConfig(validConfig)
            .withStatusCode(502)
            .withRequestId(undefined)
            .withDialog(action)
            .build();

        responseHook(context);

        expect(action).not.toHaveBeenCalled();
    });

    it('shows a dialog with a link to error tracking service when httpStatus is >= 400 and request ID is present', () => {
        const action = jest.fn();
        const context = new ContextBuilder()
            .withConfig(validConfig)
            .withStatusCode(502)
            .withRequestId('11111111-2222-3333-4444-555555555555')
            .withBody('{"error": "Something went wrong :(")}')
            .withDialog(action)
            .build();

        responseHook(context);

        expect(action).toHaveBeenCalledWith(
            expect.stringContaining('11111111-2222-3333-4444-555555555555'),
            expect.objectContaining(
                {
                    html: expect.stringContaining('http://my-service?search=11111111-2222-3333-4444-555555555555'),
                }
            )
        );
    });
});

class ContextBuilder {

    constructor() {
        this.app = {};
        this.request = {};
        this.response = {};
    }

    withConfig(value) {
        this.request.getEnvironmentVariable = () => value;
        return this;
    }

    withStatusCode(status) {
        this.response.getStatusCode = () => status;
        return this;
    }

    withRequestId(value) {
        this.response.getHeader = () => value;
        return this;
    }

    withBody(value) {
        this.response.getBody = () => value;
        return this;
    }

    withDialog(action) {
        this.app.showGenericModalDialog = action;
        return this;
    }

    build() {
        return {
            app: this.app,
            request: this.request,
            response: this.response,
        };
    }
}
