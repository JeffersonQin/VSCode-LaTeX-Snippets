# LaTeX Snippets

This extension includes a variety of snippets for LaTeX including making environments and plotting images for functions, etc.

## Features

### Powerful Snippets for Formulas, Environments and Plotting
 - **Template** Snippet
    - `template` or `\template`: Use the default template which includes a variety of packages and declared-commands. The template will also automatically generate the title and author, as well as date, and will formate the document.
 - **Formula** Snippets:
    - `sumlarge` or `\sumlarge`: Insert a large summation notation.
    - `suminline` or `\suminline`: Insert an inline summation notation, (only in the cases when the environment is inline math environment).
    - `integrallarge` or `\integrallarge`: Insert large integral notation.
    - `integralinline` or `\integralinline`: Insert inline integral notation, (only in the cases when the environment is inline math environment).
    - `fractionlarge` or `\fractionlarge`: Insert large fraction notation.
    - `fractioninline` or `\fractioninline`: Insert inline fraction notation, (only in the cases when the environment is inline math environment).
    - `to` or `\to`: Superscript notation, as well as power notation.
 - **Environment** Snippets
    - `mathinline` or `\mathinline`: Insert inline Math Environment: `$ $`.
    - `mathcentered` or `mathcentered`: Insert centered Math Environment: `$$ $$`.
    - `section` or `\section`: Insert a new section.
    - `subsection` or `\subsection`: Insert a new subsection.
    - `theorem` or `\theorem`: Insert a theorem, whose style is already defined in the template. The serial number is automatically generated according to the section.
    - `problem` or `\problem`: Insert a problem, whose style is already defined in the template. The serial number is automatically generated according to the section.
    - `definition` or `\definition`: Insert a definition, whose style is already defined in the template. The serial number is automatically generated according to the section.
    - `proof` or `\proof`: Insert a proof, whose style is already defined in the template. The serial number is automatically generated according to the section.
    - `tab` or `\tab`: The equivalent of "\t", also known as "Tab".
    - `aligntext` or `\aligntext`: Create an align environment when the context is in the text environment. (The equivalence of `align*`)
- **Plotting** Snippets
    - `plotenvironment2d` or `\plotenvironment2d`: Create a 2DPlot Environment of pgfplots. The style declarations are already included in the snippet. Thus, you can set up the position of the `axis lines`, the `color` and the `title` of the environment.
    - `plotgraph2d` or `\plotgraph2d`: Plot a 2D Graph in the 2D graph environment, noted that this can also be used in the 3D environment.
        > In this case, you have to specify the math expression of the function and the `LaTeX` form of the function since you may want it to shown as the label of the graph. Also, the domain and the color have to be given out.
    - `plotcircle2d` or `\plotcircle2d`: Plot a 2D Circle in the 2D graph environment, noted that this can also be used in the 3D environment.
        > This snippet is implemented by using another variable t, since the normal equation of the circle: (x-a)^2+(y-b)^2=r^2 can be transformed into x=a+rcost, y=b+rsint. Noted that even if the implicit function can be transformed into two explicit functions: y=b±√(r^2-(x-a)^2),the process of adding legendentry will produce problem of colors.
    - `plotline2d` or `\plotline2d`: Plot a 2D Line in the 2D graph environment, noted that this can also be used in the 3D environment.
        > Using this snippet, you have to specify the domain of the function, the color of the graph and the slope and the y-intersect of the function. (Linear function: y=ax+b)
    - `plotellipse2d` or `\plotellipse2d`: Plot a 2D Ellipse in the 2D graph environment, noted that this can also be used in the 3D environment.
        > Since the standard equation for ellipse is x^2/a^2+y^2/b^2, the value of a and b have to be specified. Also after considering of the movement of the graph, the equation can be transformed into (x-x_0)^2/a^2+(y-y_0)^2/b^2=1. The value of x_0 and y_0 also have to be given out.
    - `plotenvironment3d` or `\plotenvironment3d`: Create a 3DPlot Environment of pgfplots. The style declarations are already included in the snippet.
        > The `title`, `colormap` and `axis lines` have to be specified.
    - `plotgraph3d` or `\plotgraph3d`: Plot a 3D Graph in the 3D graph environment created.
        > The math expression and LaTeX expression have to be specified.

I feel extremely sorry that `LaTeX` is not supported by Microsoft in `markdown`.
### Powerful Plotting Tools

Using the command `LaTeX Plotting Tool`, you can quickly draw a custom regression graph for any degree according to the points you pointed out in the canvas.
You can customize the following: 
- whether you want to include point in the graph
- the color of the curve
- the caption of the graph
- the domain
- the degree of the curve
- the coordinate position in the output environment
- the coordinate position of the points when edit
> The command can be accessed by typing `shift + command + P` in Mac OS X and `shift + ctrl + P` in Windows.

![Using Command LaTeX Plotting Tool](./lib/images/LaTeX&#32;Plotting&#32;Tool&#32;-&#32;2.gif)

The tool will automatically copy the LaTeX code onto your pasteboard, and you can plot in the `tex` file simply by pasting into the document.

![Paste in the document](./lib/images/Paste&#32;in&#32;document.gif)

## Requirements

With LaTeX in the path.

Dependency: 
- `js-polynomial-regression` [Github Link](https://github.com/RobertMenke/JS-Polynomial-Regression).

With VSCode Verson no lower than `1.41.0`

> Tip: `Auto-save` option is recommended to be enabled.
> `LaTeX Workshop` extension is recommended to be installed, it's available in the market place.

## Github

The Github page of this project is [https://github.com/JeffersonQin/VSCode-LaTeX-Snippets](https://github.com/JeffersonQin/VSCode-LaTeX-Snippets). If you have any suggestion or want to have some additional functions, please feel free to contact me (my personal e-mail: 1247006353@qq.com) or write a review either here or at github. Thank you.


## Extension Settings

## Known Issues

No known issues yet.

## Release Notes

### 1.0.0

Initial release of latex-snippets-jeff.

### 1.0.1

Rename the project.

### 1.1.0

Add new functions. Now you can plot the regression graphs quickly by using the `LaTeX Plotting Tool` command.

### 1.1.1

Add feature descriptions to `README.md` and bug fix.

### 1.1.2

Adding Information.

### 1.1.3

Fix introduction page.

### 1.1.4

Add icon.

### 1.1.5

Bug Fix:
- Fix the misspelling of word 'theorem'
- Fix the snippets: `proof` and `definition`