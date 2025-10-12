import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import TrestleModel from '../src/js/model/TrestleModel.js'

const createEventBus = () => ({
    on: vi.fn(),
    emit: vi.fn()
})

describe('TrestleModel', () => {
    it('should be defined', () => {
        expect(TrestleModel).toBeDefined()
    })

    describe('saveData persistence', () => {
        let eventBus
        let setItemSpy

        beforeEach(() => {
            eventBus = createEventBus()
            if (typeof window.localStorage?.clear === 'function') {
                window.localStorage.clear()
            }
            setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
        })

        afterEach(() => {
            vi.restoreAllMocks()
            if (typeof vi.unstubAllGlobals === 'function') {
                vi.unstubAllGlobals()
            }
        })

        it('saves to localStorage and SPARQL endpoint when configured', async () => {
            const fetchSpy = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    statusText: 'OK'
                })
            )
            vi.stubGlobal('fetch', fetchSpy)

            const model = new TrestleModel(
                {
                    query: 'http://example.com/query',
                    update: 'http://example.com/update'
                },
                'http://hyperdata.it/trestle/',
                eventBus
            )

            model.createEmptyModel()

            const result = await model.saveData()

            expect(setItemSpy).toHaveBeenCalledWith(
                'trestle-outline',
                expect.any(String)
            )
            expect(window.localStorage.getItem('trestle-outline')).toBeTruthy()
            expect(fetchSpy).toHaveBeenCalledTimes(1)
            expect(fetchSpy).toHaveBeenCalledWith(
                'http://example.com/update',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/sparql-update',
                        Authorization: 'Basic YWRtaW46YWRtaW4xMjM='
                    })
                })
            )
            expect(result.local).toBe(true)
            expect(result.sparql).toBe(true)
        })

        it('falls back to localStorage when SPARQL save fails', async () => {
            const fetchSpy = vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                    statusText: 'Server Error'
                })
            )
            vi.stubGlobal('fetch', fetchSpy)

            const model = new TrestleModel(
                {
                    query: 'http://example.com/query',
                    update: 'http://example.com/update'
                },
                'http://hyperdata.it/trestle/',
                eventBus
            )

            model.createEmptyModel()

            const result = await model.saveData()

            expect(setItemSpy).toHaveBeenCalled()
            expect(fetchSpy).toHaveBeenCalledWith(
                'http://example.com/update',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Basic YWRtaW46YWRtaW4xMjM='
                    })
                })
            )
            expect(result.local).toBe(true)
            expect(result.sparql).toBe(false)
            expect(eventBus.emit).toHaveBeenCalledWith(
                'model:error',
                expect.objectContaining({
                    message: expect.stringContaining('Failed to persist data to SPARQL endpoint')
                })
            )
        })
    })
})
