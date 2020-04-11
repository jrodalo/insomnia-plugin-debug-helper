const responseHook = require('..').responseHooks[0];

const context = {
    app: {},
    request: {},
    response: {},
};

const validConfig = {
    REQUEST_ID_HEADER: 'request_id_header',
    DEBUG_URL: 'http://my-service?search=__REQUEST_ID__',
};

describe('Debug Helper', () => {

    it('shows a help message when configuration is missing', () => {
        context.request.getEnvironmentVariable = () => { };
        context.app.showGenericModalDialog = jest.fn();

        responseHook(context);

        expect(context.app.showGenericModalDialog).toHaveBeenCalledWith(
            'Debug Helper config missing',
            expect.objectContaining(
                {
                    html: expect.any(String)
                }
            )
        );
    });

    it('does nothing when httpStatus < 400', () => {
        context.request.getEnvironmentVariable = () => validConfig;
        context.response.getStatusCode = () => 200;
        context.response.getHeader = () => '11111111-2222-3333-4444-555555555555';
        context.app.showGenericModalDialog = jest.fn();

        responseHook(context);

        expect(context.app.showGenericModalDialog).not.toHaveBeenCalled();
    });

    it('does nothing when no request id', () => {
        context.request.getEnvironmentVariable = () => validConfig;
        context.response.getStatusCode = () => 502;
        context.response.getHeader = () => undefined;
        context.app.showGenericModalDialog = jest.fn();

        responseHook(context);

        expect(context.app.showGenericModalDialog).not.toHaveBeenCalled();
    });

    it('shows a dialog with a link to error tracking service when httpStatus is >= 400 and request ID is present', () => {
        context.request.getEnvironmentVariable = () => validConfig;
        context.response.getStatusCode = () => 502;
        context.response.getHeader = () => '11111111-2222-3333-4444-555555555555';
        context.response.getBody = () => '{"error": "Something went wrong :(")}';
        context.app.showGenericModalDialog = jest.fn();

        responseHook(context);

        expect(context.app.showGenericModalDialog).toHaveBeenCalledWith(
            expect.stringContaining('11111111-2222-3333-4444-555555555555'),
            expect.objectContaining(
                {
                    html: expect.stringContaining('http://my-service?search=11111111-2222-3333-4444-555555555555'),
                }
            )
        );
    });
});
