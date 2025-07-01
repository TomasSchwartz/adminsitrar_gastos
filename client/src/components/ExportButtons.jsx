import React from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportButtons({ data }) {
    const handleExportCSV = () => {
        const csv = Papa.unparse(data.map(exp => ({
            Fecha: exp.date.slice(0, 10),
            Categoría: exp.category,
            Descripción: exp.description,
            Monto: exp.amount
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gastos.csv';
        a.click();
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Lista de Gastos', 14, 16);
        doc.autoTable({
            head: [['Fecha', 'Categoría', 'Descripción', 'Monto']],
            body: data.map(exp => [
                exp.date.slice(0, 10),
                exp.category,
                exp.description,
                `$${exp.amount}`
            ]),
            startY: 20,
        });
        doc.save('gastos.pdf');
    };

    return (
        <div className="flex gap-2 mb-4">
            <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
            >
                Exportar CSV
            </button>
            <button
                onClick={handleExportPDF}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded"
            >
                Exportar PDF
            </button>
        </div>
    );
}
