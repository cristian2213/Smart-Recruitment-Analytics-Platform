import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Paragraph,
    List,
    Link,
    Heading,
    BlockQuote,
    Undo,
    Font,
    Alignment,
    Indent,
    IndentBlock,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    Code,
    HorizontalLine,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    RemoveFormat,
    SpecialCharacters,
    FindAndReplace,
    Autoformat,
    SpecialCharactersEssentials
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface EditorProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
}

export default function Editor({ value, onChange, placeholder }: EditorProps) {
    return (
        <div className="flex h-full w-full flex-col prose max-w-none dark:prose-invert [&_.ck-editor]:flex [&_.ck-editor]:flex-col [&_.ck-editor]:h-full [&_.ck-editor__main]:flex-1 [&_.ck-editor__main]:overflow-auto [&_.ck-editor__editable]:h-full [&_.ck-editor__editable]:min-h-full [&_.ck-editor__editable]:rounded-b-lg [&_.ck-toolbar]:rounded-t-lg [&_.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)]:border-sidebar-border [&_.ck.ck-toolbar]:border-sidebar-border [&_.ck.ck-toolbar]:bg-sidebar [&_.ck.ck-toolbar]:text-sidebar-foreground">
            <CKEditor
                editor={ClassicEditor}
                config={{
                    licenseKey: 'GPL',
                    toolbar: {
                        items: [
                            'undo', 'redo', '|',
                            'heading', '|',
                            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'removeFormat', '|',
                            'alignment', '|',
                            'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                            'link', 'insertTable', 'horizontalLine', 'specialCharacters', 'blockQuote', '|',
                            'findAndReplace'
                        ],
                        shouldNotGroupWhenFull: false
                    },
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Italic,
                        List,
                        Link,
                        Heading,
                        BlockQuote,
                        Undo,
                        Font,
                        Alignment,
                        Indent,
                        IndentBlock,
                        Underline,
                        Strikethrough,
                        Subscript,
                        Superscript,
                        Code,
                        HorizontalLine,
                        Table,
                        TableToolbar,
                        TableProperties,
                        TableCellProperties,
                        RemoveFormat,
                        SpecialCharacters,
                        SpecialCharactersEssentials,
                        FindAndReplace,
                        Autoformat
                    ],
                    table: {
                        contentToolbar: [
                            'tableColumn',
                            'tableRow',
                            'mergeTableCells',
                            'tableProperties',
                            'tableCellProperties'
                        ]
                    },
                    placeholder: placeholder,
                }}
                data={value}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </div>
    );
}
