"use strict";
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// dojo
var i18n = require("dojo/i18n!./Share/nls/resources");
var watchUtils = require("esri/core/watchUtils");
var intl_1 = require("esri/intl");
// esri.core.accessorSupport
var decorators_1 = require("esri/core/accessorSupport/decorators");
// esri.widgets
var Widget = require("esri/widgets/Widget");
//esri.widgets.support
var widget_1 = require("esri/widgets/support/widget");
// View Model
var ShareViewModel = require("./Share/ShareViewModel");
//----------------------------------
//
//  CSS Classes
//
//----------------------------------
var CSS = {
    base: "esri-share",
    shareModalStyles: "esri-share__share-modal",
    shareButton: "esri-share__share-button",
    shareModal: {
        close: "esri-share__close",
        shareIframe: {
            iframeContainer: "esri-share__iframe-container",
            iframeTabSectionContainer: "esri-share__iframe-tab-section-container",
            iframeInputContainer: "esri-share__iframe-input-container",
            iframePreview: "esri-share__iframe-preview",
            iframeInput: "esri-share__iframe-input",
            embedContentContainer: "esri-share__embed-content-container"
        },
        shareTabStyles: {
            tabSection: "esri-share__tab-section",
            iframeTab: "esri-share__iframe-tab-section"
        },
        header: {
            container: "esri-share__header-container",
            heading: "esri-share__heading"
        },
        main: {
            mainContainer: "esri-share__main-container",
            mainHeader: "esri-share__main-header",
            mainHR: "esri-share__hr",
            mainCopy: {
                copyButton: "esri-share__copy-button",
                copyContainer: "esri-share__copy-container",
                copyClipboardUrl: "esri-share__copy-clipboard-url",
                copyClipboardContainer: "esri-share__copy-clipboard-container",
                copyClipboardIframe: "esri-share__copy-clipboard-iframe"
            },
            mainUrl: {
                inputGroup: "esri-share__copy-url-group",
                urlInput: "esri-share__url-input",
                linkGenerating: "esri-share--link-generating"
            },
            mainShare: {
                shareContainer: "esri-share__share-container",
                shareItem: "esri-share__share-item",
                shareItemContainer: "esri-share__share-item-container",
                shareIcons: {
                    facebook: "icon-social-facebook",
                    twitter: "icon-social-twitter",
                    email: "icon-social-contact",
                    linkedin: "icon-social-linkedin",
                    pinterest: "icon-social-pinterest",
                    rss: "icon-social-rss"
                }
            },
            mainInputLabel: "esri-share__input-label"
        },
        calciteStyles: {
            modifier: "modifier-class",
            isActive: "is-active",
            tooltip: "tooltip",
            tooltipTop: "tooltip-top",
            modal: {
                jsModal: "js-modal",
                jsModalToggle: "js-modal-toggle",
                modalContent: "modal-content",
                modalOverlay: "modal-overlay"
            },
            tabs: {
                jsTab: "js-tab",
                jsTabSection: "js-tab-section",
                tabGroup: "js-tab-group",
                tabNav: "tab-nav",
                tabTitle: "tab-title",
                tabContents: "tab-contents",
                tabSection: "tab-section"
            }
        }
    },
    icons: {
        widgetIcon: "esri-icon-share",
        copyIconContainer: "esri-share__copy-icon-container",
        copy: "esri-share__copy-icon",
        esriLoader: "esri-share__loader",
        closeIcon: "icon-ui-close",
        copyToClipboardIcon: "icon-ui-duplicate"
    }
};
var Share = /** @class */ (function (_super) {
    __extends(Share, _super);
    function Share(params) {
        var _this = _super.call(this, params) || this;
        //----------------------------------
        //
        //  Private Variables
        //
        //----------------------------------
        // Tabs
        _this._linkTabExpanded = true;
        _this._embedTabExpanded = false;
        // Tooltips
        _this._linkCopied = false;
        _this._embedCopied = false;
        //  DOM Nodes //
        // URL Input & Iframe Input
        _this._iframeInputNode = null;
        _this._urlInputNode = null;
        //----------------------------------
        //
        //  Properties
        //
        //----------------------------------
        //----------------------------------
        //
        //  view
        //
        //----------------------------------
        _this.view = null;
        //----------------------------------
        //
        //  shareModalOpened
        //
        //----------------------------------
        _this.shareModalOpened = null;
        //----------------------------------
        //
        //  shareItems
        //
        //----------------------------------
        _this.shareItems = null;
        //----------------------------------
        //
        //  shareFeatures
        //
        //----------------------------------
        _this.shareFeatures = null;
        //----------------------------------
        //
        //  shareUrl - readOnly
        //
        //----------------------------------
        _this.shareUrl = null;
        //----------------------------------
        //
        //  iconClass and label - Expand Widget Support
        //
        //----------------------------------
        _this.iconClass = CSS.icons.widgetIcon;
        _this.label = i18n.widgetLabel;
        //----------------------------------
        //
        //  viewModel
        //
        //----------------------------------
        _this.viewModel = new ShareViewModel();
        return _this;
    }
    //----------------------------------
    //
    //  Lifecycle
    //
    //----------------------------------
    Share.prototype.postInitialize = function () {
        var _this = this;
        this.own([
            watchUtils.whenTrue(this, "view.ready", function () {
                _this.own([
                    watchUtils.init(_this, "shareModalOpened", function () {
                        _this._detectWidgetToggle();
                    })
                ]);
            })
        ]);
    };
    Share.prototype.destroy = function () {
        this._iframeInputNode = null;
        this._urlInputNode = null;
    };
    Share.prototype.render = function () {
        var shareModalNode = this._renderShareModal();
        return (<div class={CSS.base} aria-labelledby="shareModal">
        <button class={this.classes(CSS.shareModal.calciteStyles.modal.jsModalToggle, CSS.icons.widgetIcon, CSS.shareButton)} bind={this} title={i18n.heading} onclick={this._toggleShareModal} onkeydown={this._toggleShareModal}/>
        {shareModalNode}
      </div>);
    };
    Share.prototype._toggleShareModal = function () {
        this.shareModalOpened = !this.shareModalOpened;
    };
    Share.prototype._detectWidgetToggle = function () {
        if (this.shareModalOpened) {
            this._generateUrl();
        }
        else {
            this._removeCopyTooltips();
        }
        this.scheduleRender();
    };
    Share.prototype._copyUrlInput = function () {
        this._urlInputNode.focus();
        this._urlInputNode.setSelectionRange(0, this._urlInputNode.value.length);
        document.execCommand("copy");
        this._linkCopied = true;
        this._embedCopied = false;
        this.scheduleRender();
    };
    Share.prototype._copyIframeInput = function () {
        this._iframeInputNode.focus();
        this._iframeInputNode.setSelectionRange(0, this._iframeInputNode.value.length);
        document.execCommand("copy");
        this._linkCopied = false;
        this._embedCopied = true;
        this.scheduleRender();
    };
    Share.prototype._linkTab = function () {
        // Link Tab Option
        this._linkTabExpanded = true;
        this._embedTabExpanded = false;
        this.scheduleRender();
    };
    Share.prototype._embedTab = function () {
        // Embed Tab Option
        this._linkTabExpanded = false;
        this._embedTabExpanded = true;
        this.scheduleRender();
    };
    Share.prototype._processShareItem = function (event) {
        var node = event.currentTarget;
        var shareItem = node["data-share-item"];
        var urlTemplate = shareItem.urlTemplate;
        var portalItem = this.get("view.map.portalItem");
        var title = portalItem
            ? intl_1.substitute(i18n.urlTitle, { title: portalItem.title })
            : null;
        var summary = portalItem
            ? intl_1.substitute(i18n.urlSummary, { summary: portalItem.snippet })
            : null;
        this._openUrl(this.shareUrl, title, summary, urlTemplate);
    };
    Share.prototype._stopPropagation = function (e) {
        e.stopPropagation();
    };
    Share.prototype._generateUrl = function () {
        this.viewModel.generateUrl();
    };
    Share.prototype._removeCopyTooltips = function () {
        this._linkCopied = false;
        this._embedCopied = false;
        this.scheduleRender();
    };
    Share.prototype._openUrl = function (url, title, summary, urlTemplate) {
        var urlToOpen = intl_1.substitute(urlTemplate, {
            url: encodeURI(url),
            title: title,
            summary: summary
        });
        window.open(urlToOpen);
    };
    // Render Nodes
    Share.prototype._renderShareModal = function () {
        var _a;
        var modalContainerNode = this._renderModalContainer();
        var shareModalClass = (_a = {},
            _a[CSS.shareModal.calciteStyles.isActive] = this.shareModalOpened,
            _a);
        return (<div class={this.classes(CSS.shareModal.calciteStyles.modal.jsModal, CSS.shareModal.calciteStyles.modal.modalOverlay, CSS.shareModal.calciteStyles.modifier, shareModalClass)} bind={this} onclick={this._toggleShareModal} onkeydown={this._toggleShareModal}>
        {modalContainerNode}
      </div>);
    };
    Share.prototype._renderModalContainer = function () {
        var modalContentNode = this._renderModalContent();
        return (<div class={this.classes(CSS.shareModalStyles, CSS.shareModal.calciteStyles.modal.modalContent)} tabIndex={0} bind={this} onclick={this._stopPropagation} onkeydown={this._stopPropagation}>
        <h1 id="shareModal" class={CSS.shareModal.header.heading}>
          {i18n.heading}
        </h1>
        <div>{modalContentNode}</div>
        <div bind={this} onclick={this._toggleShareModal} onkeydown={this._toggleShareModal} class={this.classes(CSS.shareModal.calciteStyles.modal.jsModalToggle, CSS.shareModal.close, CSS.icons.closeIcon)} aria-label="close-modal" tabIndex={0}/>
      </div>);
    };
    Share.prototype._renderModalContent = function () {
        var _a, _b;
        var embedMap = this.shareFeatures.embedMap;
        var sendALinkContentNode = this._renderSendALinkContent();
        var embedMapContentNode = this._renderEmbedMapContent();
        var linkTabClass = (_a = {},
            _a[CSS.shareModal.calciteStyles.isActive] = this._linkTabExpanded,
            _a);
        var embedTabClass = (_b = {},
            _b[CSS.shareModal.calciteStyles.isActive] = this._embedTabExpanded,
            _b);
        return (<div class={CSS.shareModal.main.mainContainer}>
        <div class={this.classes(CSS.shareModal.calciteStyles.modifier, CSS.shareModal.calciteStyles.tabs.tabGroup)}>
          {embedMap ? (<nav class={CSS.shareModal.calciteStyles.tabs.tabNav}>
              <div class={this.classes(CSS.shareModal.calciteStyles.tabs.tabTitle, CSS.shareModal.calciteStyles.tabs.jsTab, linkTabClass)} bind={this} tabIndex={0} onclick={this._linkTab} onkeydown={this._linkTab} aria-expanded={"" + this._linkTabExpanded}>
                {i18n.sendLink}
              </div>
              {embedMap ? (<div class={this.classes(CSS.shareModal.calciteStyles.tabs.tabTitle, CSS.shareModal.calciteStyles.tabs.jsTab, embedTabClass)} bind={this} tabIndex={0} onclick={this._embedTab} onkeydown={this._embedTab} aria-expanded={"" + this._embedTabExpanded}>
                  {i18n.embedMap}
                </div>) : null}
            </nav>) : null}
          <section class={CSS.shareModal.calciteStyles.tabs.tabContents}>
            {sendALinkContentNode}
            {embedMapContentNode}
          </section>
        </div>
      </div>);
    };
    Share.prototype._renderShareItem = function (shareItem) {
        var name = shareItem.name, className = shareItem.className;
        return (<div class={this.classes(CSS.shareModal.main.mainShare.shareItem, name)} key={name}>
        <div class={className} title={name} onclick={this._processShareItem} onkeydown={this._processShareItem} tabIndex={0} aria-label={name} bind={this} data-share-item={shareItem} role="button"/>
      </div>);
    };
    Share.prototype._renderShareItems = function () {
        var _this = this;
        var shareServices = this.shareItems;
        var shareIcons = CSS.shareModal.main.mainShare.shareIcons;
        // Assign class names of icons to share item
        shareServices.forEach(function (shareItem) {
            for (var icon in shareIcons) {
                if (icon === shareItem.id) {
                    shareItem.className = shareIcons[shareItem.id];
                }
            }
        });
        return shareServices
            .toArray()
            .map(function (shareItems) { return _this._renderShareItem(shareItems); });
    };
    Share.prototype._renderShareItemContainer = function () {
        var shareServices = this.shareFeatures.shareServices;
        var state = this.viewModel.state;
        var shareItemNodes = shareServices ? this._renderShareItems() : null;
        var shareItemNode = shareServices
            ? state === "ready" && shareItemNodes.length
                ? [shareItemNodes]
                : null
            : null;
        return (<div>
        {shareServices ? (<div class={CSS.shareModal.main.mainShare.shareContainer} key="share-container">
            <h2 class={CSS.shareModal.main.mainHeader}>{i18n.subHeading}</h2>
            <div class={CSS.shareModal.main.mainShare.shareItemContainer}>
              {shareItemNode}
            </div>
          </div>) : null}
      </div>);
    };
    Share.prototype._renderCopyUrl = function () {
        var _a;
        var copyToClipboard = this.shareFeatures.copyToClipboard;
        var toolTipClasses = (_a = {},
            _a[CSS.shareModal.calciteStyles.tooltip] = this._linkCopied,
            _a[CSS.shareModal.calciteStyles.tooltipTop] = this._linkCopied,
            _a);
        return (<div>
        {copyToClipboard ? (<div class={CSS.shareModal.main.mainCopy.copyContainer} key="copy-container">
            <div class={CSS.shareModal.main.mainUrl.inputGroup}>
              <h2 class={CSS.shareModal.main.mainHeader}>{i18n.clipboard}</h2>
              <div class={CSS.shareModal.main.mainCopy.copyClipboardContainer}>
                <div class={this.classes(CSS.shareModal.main.mainCopy.copyClipboardUrl, toolTipClasses)} bind={this} onclick={this._copyUrlInput} onkeydown={this._copyUrlInput} tabIndex={0} aria-label={i18n.copied} role="button">
                  <div class={this.classes(CSS.icons.copy, CSS.icons.copyToClipboardIcon)}/>
                </div>
                <input type="text" class={CSS.shareModal.main.mainUrl.urlInput} bind={this} value={this.shareUrl} afterCreate={widget_1.storeNode} data-node-ref="_urlInputNode" readOnly/>
              </div>
            </div>
          </div>) : null}
      </div>);
    };
    Share.prototype._renderSendALinkContent = function () {
        var _a;
        var copyUrlNode = this._renderCopyUrl();
        var shareServicesNode = this._renderShareItemContainer();
        var _b = this.shareFeatures, shareServices = _b.shareServices, copyToClipboard = _b.copyToClipboard;
        var state = this.viewModel.state;
        var linkContentClass = (_a = {},
            _a[CSS.shareModal.calciteStyles.isActive] = this._linkTabExpanded,
            _a);
        return (<article class={this.classes(CSS.shareModal.calciteStyles.tabs.tabSection, CSS.shareModal.calciteStyles.tabs.jsTabSection, CSS.shareModal.shareTabStyles.tabSection, linkContentClass)} bind={this} aria-expanded={"" + this._linkTabExpanded}>
        {state === "ready" ? (<div>
            {shareServicesNode}
            {!copyToClipboard || !shareServices ? null : (<hr class={CSS.shareModal.main.mainHR}/>)}
            {copyUrlNode}
          </div>) : (<div class={CSS.icons.esriLoader}/>)}
      </article>);
    };
    Share.prototype._renderCopyIframe = function () {
        var _a;
        var _b = this.viewModel, embedCode = _b.embedCode, state = _b.state;
        var toolTipClasses = (_a = {},
            _a[CSS.shareModal.calciteStyles.tooltip] = this._embedCopied,
            _a[CSS.shareModal.calciteStyles.tooltipTop] = this._embedCopied,
            _a);
        return (<div class={CSS.shareModal.shareIframe.iframeInputContainer}>
        <div class={this.classes(CSS.shareModal.main.mainCopy.copyClipboardIframe, toolTipClasses)} bind={this} onclick={this._copyIframeInput} onkeydown={this._copyIframeInput} aria-label={i18n.copied} tabIndex={0} role="button">
          <div class={this.classes(CSS.icons.copyToClipboardIcon, CSS.icons.copy)}/>
        </div>

        {state === "ready" ? (<input class={CSS.shareModal.shareIframe.iframeInput} type="text" tabindex={0} value={embedCode} bind={this} afterCreate={widget_1.storeNode} data-node-ref="_iframeInputNode" readOnly/>) : (<div class={CSS.shareModal.main.mainUrl.linkGenerating}>
            {i18n.generateLink}
          </div>)}
      </div>);
    };
    Share.prototype._renderEmbedMapContent = function () {
        var _a;
        var embedMap = this.shareFeatures.embedMap;
        var state = this.viewModel.state;
        var copyIframeCodeNode = this._renderCopyIframe();
        var embedContentClass = (_a = {},
            _a[CSS.shareModal.calciteStyles.isActive] = this._embedTabExpanded,
            _a);
        return (<div class={CSS.shareModal.shareIframe.embedContentContainer}>
        {embedMap ? (<article class={this.classes(CSS.shareModal.calciteStyles.tabs.tabSection, CSS.shareModal.calciteStyles.tabs.jsTabSection, CSS.shareModal.shareTabStyles.tabSection, CSS.shareModal.shareTabStyles.iframeTab, embedContentClass)} bind={this} aria-expanded={"" + this._embedTabExpanded}>
            {state === "ready" ? (<div key="iframe-tab-section-container" class={CSS.shareModal.shareIframe.iframeTabSectionContainer}>
                <h2 class={CSS.shareModal.main.mainHeader}>{i18n.clipboard}</h2>
                {copyIframeCodeNode}
                <div class={CSS.shareModal.shareIframe.iframeContainer}>
                  {embedMap ? (state === "ready" ? (this.shareModalOpened ? (<iframe class={CSS.shareModal.shareIframe.iframePreview} src={this.shareUrl} tabIndex="-1" scrolling="no"/>) : null) : null) : null}
                </div>
              </div>) : (<div class={CSS.icons.esriLoader}/>)}
          </article>) : null}
      </div>);
    };
    __decorate([
        decorators_1.aliasOf("viewModel.view"),
        decorators_1.property()
    ], Share.prototype, "view");
    __decorate([
        decorators_1.aliasOf("viewModel.shareModalOpened"),
        widget_1.renderable()
    ], Share.prototype, "shareModalOpened");
    __decorate([
        decorators_1.aliasOf("viewModel.shareItems"),
        widget_1.renderable()
    ], Share.prototype, "shareItems");
    __decorate([
        decorators_1.aliasOf("viewModel.shareFeatures"),
        widget_1.renderable()
    ], Share.prototype, "shareFeatures");
    __decorate([
        decorators_1.aliasOf("viewModel.shareUrl"),
        widget_1.renderable()
    ], Share.prototype, "shareUrl");
    __decorate([
        decorators_1.property()
    ], Share.prototype, "iconClass");
    __decorate([
        decorators_1.property()
    ], Share.prototype, "label");
    __decorate([
        widget_1.renderable([
            "viewModel.state",
            "viewModel.embedCode",
            "viewModel.shareFeatures"
        ]),
        decorators_1.property({
            type: ShareViewModel
        })
    ], Share.prototype, "viewModel");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_toggleShareModal");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_copyUrlInput");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_copyIframeInput");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_linkTab");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_embedTab");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_processShareItem");
    __decorate([
        widget_1.accessibleHandler()
    ], Share.prototype, "_stopPropagation");
    Share = __decorate([
        decorators_1.subclass("Share")
    ], Share);
    return Share;
}(decorators_1.declared(Widget)));
module.exports = Share;
