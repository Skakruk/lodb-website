import {Link} from 'react-router';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';

export default function(content) {
    return Parser(content, {
        replace: function (domNode) {
            if (domNode.name === 'a') {
                return <Link to={domNode.attribs.href}>
                    {domToReact(domNode.children)}
                </Link>
            }

            if (domNode.name === 'img') {
                return <a href="#">
                    <img width={domNode.attribs.width}
                         height={domNode.attribs.height}
                         alt={domNode.attribs.alt}
                         src={`${domNode.attribs.src}?wh=${domNode.attribs.width}x${domNode.attribs.height}`}/>
                </a>;
            }
        }
    });
}