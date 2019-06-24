import {Iline, Receiver, Resolver} from '../resolver'

describe('test resolver module', () => {

    describe('Receiver module', () => {

        const header = 'WorkOrderView {'
        const body = 'cityCode (string, optional): 工单信息: 城市code,'
        const foot = ' } '

        it('should get Receiver instance correctly', function () {
            const testInstance = Receiver.instance()
            expect(testInstance ).toBeInstanceOf(Receiver)
        })
        it('should return Receiver instance after calling receive', function () {
            const instance = Receiver.instance()
            const testInstance = instance.receive('')
            expect(testInstance).toBeInstanceOf(Receiver)
        })

        it('should throw Error when passing header is ""', function () {
            const instance = Receiver.instance()
            instance.header = ''
            expect(() => instance.receive(body)).toThrowError()
        });
        it('should receive header correctly', function () {
            const instance = Receiver.instance()
            instance.receive(header)
            expect(instance.header).toBe('WorkOrderView')
            expect(instance.offset).toBe(-1)
            expect(instance.result['WorkOrderView']).toEqual([])
        })

        it('should throw Error when passing header after offset is -1', function () {
            const instance = Receiver.instance()
            instance.offset = -1
            expect(() => instance.receive(header)).toThrowError()
        })

        it('should return Iline calling resolveBody', function () {
            const instance = Receiver.instance()
            const result: Iline = instance.resolveBody(body)
            expect(result).toEqual({
                name: 'cityCode',
                type: 'string',
                optional: 'optional',
                comment: ' 工单信息: 城市code,'
            })
        })

        it('should make offset to 0 when pass foot into receive', function () {
            const instance = Receiver.instance()
            instance.offset = -1
            instance.receive(foot)
            expect(instance.offset).toBe(0)
            expect(instance.header).toBe('')
        });

        xit('should throw error when pass foot after offset is not -1', function () {
            const instance = Receiver.instance()
            instance.offset = 0
            expect(() => instance.receive(foot)).toThrowError()
        })

        it('should throw Error when passing body after offset is not -1', function () {
            const instance = Receiver.instance()
            instance.offset = 0
            expect(() => instance.receive(body)).toThrowError()
        })

    })
})
