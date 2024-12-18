import type {OperatingSystem} from '@eighty4/install-template'
import {OPERATING_SYSTEMS} from '@eighty4/install-template'
import css from './RepositoryLink.css?inline'
import html from './RepositoryLink.html?raw'
import SystemLogo from '../SystemLogo.ts'
import {configureRepoCache} from '../../sessionCache.ts'
import {cloneTemplate} from '../../dom.ts'
import {pushConfigureRoute} from '../../router.ts'
import type {RepositoryWithScript} from '../../routes/searchData.ts'

export default class RepositoryLink extends HTMLElement {

    private static readonly TEMPLATE_ID = 'tmpl-repo-link'

    static templateHTML(): string {
        return `<template id="${this.TEMPLATE_ID}"><style>${css}</style>${html}</template>`
    }

    readonly #repo: RepositoryWithScript

    readonly #shadow: ShadowRoot

    constructor(readonly repo: RepositoryWithScript) {
        super()
        this.#repo = repo
        this.#shadow = this.attachShadow({mode: 'open'})
        this.#shadow.appendChild(cloneTemplate(RepositoryLink.TEMPLATE_ID))
        this.#render()
    }

    connectedCallback() {
        this.addEventListener('click', this.#onClick)
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.#onClick)
    }

    #onClick = () => {
        configureRepoCache.write(this.#repo)
        pushConfigureRoute(this.#repo)
    }

    #render() {
        this.#shadow.querySelector('profile-picture')!.setAttribute('owner', this.#repo.owner)
        if (this.#repo.script) {
            this.#shadow.querySelector('.link')!.appendChild(this.#createScriptVersion(this.#repo.script.templateVersion))
        }
        this.#shadow.querySelector('.name')!.textContent = `${this.#repo.owner}/${this.#repo.name}`
        this.#shadow.querySelector('.update')!.textContent = this.#repo.latestRelease?.commitHash || ''
        this.#shadow.querySelector('.version')!.textContent = this.#repo.latestRelease?.tag || ''
        if (this.#repo.latestRelease) {
            const oses: Array<OperatingSystem> = []
            for (const os of OPERATING_SYSTEMS) {
                if (this.#repo.latestRelease?.binaries.some(b => b.os === os)) {
                    oses.push(os)
                }
            }
            this.#shadow!.querySelector('.os-logos')!.append(...oses.map(os => new SystemLogo({os})))
        }
    }

    #createScriptVersion(templateVersion: string): HTMLElement {
        const scriptVersion = document.createElement('p')
        scriptVersion.classList.add('deets')
        const checkmark = document.createElement('span')
        checkmark.style.color = 'lightgreen'
        checkmark.style.display = 'flex'
        checkmark.innerHTML = '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>'
        scriptVersion.appendChild(checkmark)
        scriptVersion.appendChild(document.createTextNode(templateVersion + ' is up to date'))
        return scriptVersion
    }
}
