'use strict'

function addSepiaStyle() {
    function toggleSepiaStyle() {
        const isSepiaEnabled = localStorage.getItem('kai_sepia') === 'true';
        
        if (isSepiaEnabled) {
            removeSepiaStyle();
            localStorage.setItem('kai_sepia', 'false');
            updateButtonStatus(false);
        } else {
            applySepiaStyle();
            localStorage.setItem('kai_sepia', 'true');
            updateButtonStatus(true);
        }
    }
    
    function applySepiaStyle() {
        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            pageWrapper.style.backgroundColor = '#f8f4e8';
            pageWrapper.style.color = '#5a4a42';
        }
        
        const body = document.querySelector('body');
        if (body) {
            body.style.backgroundColor = '#f8f4e8';
            body.style.color = '#5a4a42';
        }
        
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = '#e8dfd0';
        }

        const contentBoxes = document.querySelectorAll('.news_box, .content_box, .box, .events_box, .institutes_slider_box, .research_box, .welcome_box');
        contentBoxes.forEach(box => {
            box.style.backgroundColor = '#f9f5eb';
            box.style.border = '2px solid #d4c4a8';
        });
        
        const menuItems = document.querySelectorAll('.menu a, .box_links a');
        menuItems.forEach(item => {
            item.style.color = '#7d6b5a';
        });
        
        if (header) {
            const headerParent = header.parentElement;
            if (headerParent) {
                headerParent.style.backgroundColor = '#e8dfd0';
            }
        }
        
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            heading.style.color = '#8b7355';
        });
        
        const newsItems = document.querySelectorAll('.news_box .item, .journal-content-article, .portlet-body');
        newsItems.forEach(element => {
            element.style.color = '#5a4a42';
        });
        
        const kaiButtons = document.querySelectorAll('.kai-btn, .kai-btn-block');
        kaiButtons.forEach(button => {
            button.style.backgroundColor = '#8b7355';
            button.style.color = '#ffffff';
        });
        
        if (pageWrapper) {
            const children = pageWrapper.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.transition = 'all 0.3s ease';
            }
        }
    }
    
    function removeSepiaStyle() {
        const elementsToReset = [
            '#page_wrapper',
            'body',
            'header',
            '.news_box',
            '.content_box',
            '.box',
            '.events_box',
            '.institutes_slider_box',
            '.research_box',
            '.welcome_box',
            '.menu a',
            '.box_links a',
            'h1', 'h2', 'h3',
            '.news_box .item',
            '.journal-content-article',
            '.portlet-body',
            '.kai-btn',
            '.kai-btn-block'
        ];
        
        elementsToReset.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.removeProperty('background-color');
                element.style.removeProperty('color');
                element.style.removeProperty('border');
                element.style.removeProperty('transition');
            });
        });
        
        const header = document.querySelector('header');
        if (header) {
            const headerParent = header.parentElement;
            if (headerParent) {
                headerParent.style.removeProperty('background-color');
            }
        }
        
        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            const children = pageWrapper.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.removeProperty('transition');
            }
        }
    }
    
    function updateButtonStatus(isEnabled) {
        const button = document.getElementById('sepia-toggle-btn');
        if (button) {
            button.textContent = isEnabled ? '📜 ON' : '📜 OFF';
            button.style.backgroundColor = isEnabled ? '#8b7355' : '#4285f4';
        }
    }
    
    function createToggleButton() {
        if (document.getElementById('sepia-toggle-btn')) return;

        const buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) return;

        const button = document.createElement('div');
        button.id = 'sepia-toggle-btn';
        const isEnabled = localStorage.getItem('kai_sepia') === 'true';
        button.textContent = isEnabled ? '📜 ON' : '📜 OFF';
        button.title = 'Переключить старославянский стиль';
        
        button.style.cssText = `
            width: 60px;
            height: 30px;
            border: none;
            background-color: ${isEnabled ? '#8b7355' : '#4285f4'};
            color: white;
            font-size: 14px;
            cursor: pointer;
            margin: 0 0 0 6px;
            text-align: center;
            float: left;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        
        button.addEventListener('click', toggleSepiaStyle);
        buttonContainer.appendChild(button);
        
        if (isEnabled) {
            applySepiaStyle();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addSepiaStyle();